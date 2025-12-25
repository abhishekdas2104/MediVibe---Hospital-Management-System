import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHospital, FaSignOutAlt, FaCalendarAlt, FaUserInjured, FaBed, FaHome, FaSync } from 'react-icons/fa';
import { doctorService } from '../../services';
import { getDisplayableErrorMessage } from '../../utils/errorHandler';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [duties, setDuties] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bedStats, setBedStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchDuties = async () => {
    try {
      const res = await doctorService.getDuties();
      setDuties(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load duties');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await doctorService.getPatients();
      setPatients(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load patients');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchBedStats = async () => {
    try {
      const res = await doctorService.getBedAvailability();
      setBedStats(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load bed stats');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchPatientDetails = async (id) => {
    try {
      const res = await doctorService.getPatientDetails(id);
      setSelectedPatient(res.data.data);
      setNotes(res.data.data.assignment?.notes || '');
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
      else if (activeTab === 'beds') await fetchBedStats();
      else await Promise.all([fetchDuties(), fetchPatients()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'duties') fetchDuties();
    if (activeTab === 'patients') fetchPatients();
    if (activeTab === 'beds') fetchBedStats();
  }, [activeTab]);

  const currentDuty = duties.find((d) => d.status === 'active');

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 border-r border-teal-500 border-opacity-20 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg">
            <FaHospital className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">MediVibe</h2>
            <p className="text-xs text-teal-600">Doctor Portal</p>
          </div>
        </div>

        <nav className="space-y-3 mb-8">
          {[
            { tab: 'overview', label: 'Overview', icon: FaHome },
            { tab: 'duties', label: 'My Duties', icon: FaCalendarAlt },
            { tab: 'patients', label: 'My Patients', icon: FaUserInjured },
            { tab: 'beds', label: 'Bed Status', icon: FaBed }
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

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, Dr. {user?.name.split(' ')[0]}!</h1>
            <p className="text-stone-400">Doctor Dashboard</p>
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

        {/* Overview */}
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
                    <span className="text-stone-400">Upcoming Duties</span>
                    <span className="text-white font-semibold">{duties.filter((d) => d.status === 'scheduled').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Duties */}
        {activeTab === 'duties' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Duties & Schedule</h2>
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
                                await doctorService.updateDutyStatus(duty._id, 'completed');
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

        {/* Patients */}
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
                        <p className="text-stone-400">Admitted: {new Date(p.admissionDate).toLocaleDateString()}</p>
                        <button
                          className="mt-2 text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setLoading(true);
                            try {
                              await doctorService.markVisited(p._id);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-stone-400 text-sm">Personal Details</p>
                    <div className="space-y-1 text-stone-200">
                      <p>Age: {selectedPatient.patient.dateOfBirth ? Math.floor((Date.now() - new Date(selectedPatient.patient.dateOfBirth)) / 31557600000) : 'N/A'}</p>
                      <p>Gender: {selectedPatient.patient.gender}</p>
                      <p>Blood Type: {selectedPatient.patient.bloodType}</p>
                      <p>Phone: {selectedPatient.patient.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm">Admission Details</p>
                    <div className="space-y-1 text-stone-200">
                      <p>Bed: {selectedPatient.patient.assignedBed?.bedNumber}</p>
                      <p>Ward: {selectedPatient.patient.ward}</p>
                      <p>Admitted: {new Date(selectedPatient.patient.admissionDate).toLocaleDateString()}</p>
                      <p>Status: {selectedPatient.patient.status}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Doctor's Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="5"
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white"
                  />
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await doctorService.updateNotes(selectedPatient.assignment._id, notes);
                        setError('');
                        alert('Notes updated');
                      } catch (err) {
                        setError(err.response?.data?.message || 'Failed to update notes');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bed Status */}
        {activeTab === 'beds' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Bed Availability (Read-Only)</h2>
              <button onClick={fetchBedStats} className="text-sm text-teal-400 hover:text-teal-200">Refresh</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bedStats.map((stat) => (
                <div key={stat.ward} className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2">{stat.ward} Ward</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Total</span>
                      <span className="text-white font-semibold">{stat.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600">Available</span>
                      <span className="text-teal-600 font-semibold">{stat.available}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600">Occupied</span>
                      <span className="text-teal-600 font-semibold">{stat.occupied}</span>
                    </div>
                  </div>
                </div>
              ))}
              {bedStats.length === 0 && <p className="col-span-full text-stone-400">No bed data available</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
