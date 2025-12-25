import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHospital, FaSignOutAlt, FaCalendarAlt, FaUserInjured, FaBed, FaHome, FaNotesMedical, FaSync } from 'react-icons/fa';
import { nurseService } from '../../services';
import { getDisplayableErrorMessage } from '../../utils/errorHandler';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [duties, setDuties] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [careNote, setCareNote] = useState({ note: '', vitals: {} });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchDuties = async () => {
    try {
      const res = await nurseService.getDuties();
      setDuties(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load duties');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await nurseService.getPatients();
      setPatients(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load patients');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchPatientDetails = async (id) => {
    try {
      const res = await nurseService.getPatientDetails(id);
      setSelectedPatient(res.data.data);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load patient details');
      if (errorMsg) setError(errorMsg);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'duties') await fetchDuties();
      else if (activeTab === 'patients') await fetchPatients();
      else await Promise.all([fetchDuties(), fetchPatients()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'duties') fetchDuties();
    if (activeTab === 'patients') fetchPatients();
  }, [activeTab]);

  const currentDuty = duties.find((d) => d.status === 'active');

  return (
    <div className="min-h-screen bg-stone-900">
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 border-r border-teal-500 border-opacity-20 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg">
            <FaHospital className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">MediVibe</h2>
            <p className="text-xs text-teal-600">Nurse Portal</p>
          </div>
        </div>

        <nav className="space-y-3 mb-8">
          {[
            { tab: 'overview', label: 'Overview', icon: FaHome },
            { tab: 'duties', label: 'My Duties', icon: FaCalendarAlt },
            { tab: 'patients', label: 'My Patients', icon: FaUserInjured }
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.tab ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <item.icon /> {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-xs text-teal-600">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name.split(' ')[0]}!</h1>
            <p className="text-stone-400">Nurse Dashboard</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition"
            title="Refresh data"
          >
            <FaSync /> Refresh
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Current Duty Status</h3>
                {currentDuty ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-green-400 font-semibold">On Duty</span>
                    </div>
                    <p className="text-stone-300">Ward: <span className="text-white font-semibold">{currentDuty.ward}</span></p>
                    <p className="text-stone-300">Shift: {currentDuty.shiftStart} - {currentDuty.shiftEnd}</p>
                  </div>
                ) : (
                  <p className="text-stone-400">Currently off duty</p>
                )}
              </div>

              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Assigned Patients</span>
                    <span className="text-white font-semibold">{patients.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Upcoming Shifts</span>
                    <span className="text-white font-semibold">{duties.filter((d) => d.status === 'scheduled').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'duties' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Duties & Shifts</h2>
              <button onClick={fetchDuties} className="text-sm text-teal-400 hover:text-teal-200">Refresh</button>
            </div>
            <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
              {duties.length > 0 ? (
                <div className="space-y-3">
                  {duties.map((duty) => (
                    <div key={duty._id} className="flex items-center justify-between p-4 rounded-lg bg-stone-900/60 border border-stone-700">
                      <div>
                        <p className="text-white font-semibold">{duty.ward} Ward</p>
                        <p className="text-stone-400 text-sm">{new Date(duty.shiftDate).toLocaleDateString()} • {duty.shiftStart} - {duty.shiftEnd}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        duty.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        duty.status === 'scheduled' ? 'bg-teal-500/20 text-teal-600' :
                        'bg-stone-500/20 text-stone-400'
                      }`}>
                        {duty.status}
                      </span>
                      <div className="flex items-center gap-2">
                        {duty.status !== 'completed' && (
                          <button
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                            onClick={async () => {
                              setLoading(true);
                              try {
                                await nurseService.updateDutyStatus(duty._id, 'completed');
                                await fetchDuties();
                              } catch (err) {
                                setError(err.response?.data?.message || 'Failed to update duty');
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400">No duties scheduled</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Patients</h2>
              <button onClick={fetchPatients} className="text-sm text-teal-400 hover:text-teal-200">Refresh</button>
            </div>
            {!selectedPatient ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((item) => {
                  const p = item.patient;
                  return (
                    <div
                      key={item.assignmentId}
                      className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-5 hover:border-teal-400 transition cursor-pointer"
                      onClick={() => fetchPatientDetails(p._id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{p.firstName} {p.lastName}</h3>
                        <FaUserInjured className="text-teal-600" />
                      </div>
                      <div className="space-y-1 text-sm text-stone-300">
                        <p>Age: {p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth)) / 31557600000) : 'N/A'} • {p.gender}</p>
                        <p>Bed: {p.assignedBed?.bedNumber || 'Unassigned'} • {p.ward}</p>
                        <p className="text-stone-400">Status: {p.status}</p>
                        <button
                          className="mt-2 text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setLoading(true);
                            try {
                              await nurseService.markVisited(p._id);
                              alert('Marked visited today');
                            } catch (err) {
                              setError(err.response?.data?.message || 'Failed to mark visited');
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Mark Visited Today
                        </button>
                      </div>
                    </div>
                  );
                })}
                {patients.length === 0 && <p className="col-span-full text-stone-400">No patients assigned yet</p>}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <button onClick={() => setSelectedPatient(null)} className="mb-4 text-teal-400 hover:text-teal-200">← Back to list</button>
                <h3 className="text-2xl font-bold text-white mb-4">{selectedPatient.patient.firstName} {selectedPatient.patient.lastName}</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg text-white font-semibold mb-2">Add Care Note</h4>
                  <input
                    type="text"
                    placeholder="Care note"
                    value={careNote.note}
                    onChange={(e) => setCareNote({ ...careNote, note: e.target.value })}
                    className="w-full mb-2 bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Temp (°C)"
                      onChange={(e) => setCareNote({ ...careNote, vitals: { ...careNote.vitals, temperature: Number(e.target.value) }})}
                      className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="BP (120/80)"
                      onChange={(e) => setCareNote({ ...careNote, vitals: { ...careNote.vitals, bloodPressure: e.target.value }})}
                      className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Heart Rate"
                      onChange={(e) => setCareNote({ ...careNote, vitals: { ...careNote.vitals, heartRate: Number(e.target.value) }})}
                      className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="O2 Level (%)"
                      onChange={(e) => setCareNote({ ...careNote, vitals: { ...careNote.vitals, oxygenLevel: Number(e.target.value) }})}
                      className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await nurseService.addCareNote(selectedPatient.assignment._id, careNote.note, careNote.vitals);
                        setCareNote({ note: '', vitals: {} });
                        fetchPatientDetails(selectedPatient.patient._id);
                        alert('Care note added');
                      } catch (err) {
                        setError(err.response?.data?.message || 'Failed to add note');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                  >
                    Save Care Note
                  </button>
                </div>

                {selectedPatient.assignment?.careNotes && selectedPatient.assignment.careNotes.length > 0 && (
                  <div>
                    <h4 className="text-lg text-white font-semibold mb-2">Care History</h4>
                    <div className="space-y-2">
                      {selectedPatient.assignment.careNotes.map((note, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-stone-900/60 border border-stone-700">
                          <p className="text-stone-300">{note.note}</p>
                          <p className="text-xs text-stone-500 mt-1">{new Date(note.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseDashboard;
