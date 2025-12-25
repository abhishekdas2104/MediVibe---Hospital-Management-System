import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHospital, FaSignOutAlt, FaUserPlus, FaUsers, FaBed, FaHome, FaSync } from 'react-icons/fa';
import { receptionistService } from '../../services';
import { getDisplayableErrorMessage } from '../../utils/errorHandler';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState([]);
  const [bedStats, setBedStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [admissionForm, setAdmissionForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodType: 'O+',
    address: '',
    ward: 'General',
    admissionReason: '',
    emergencyContact: { name: '', phone: '', relation: '' }
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchPatients = async () => {
    try {
      const res = await receptionistService.getPatients();
      setPatients(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load patients');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchBedStats = async () => {
    try {
      const res = await receptionistService.getBedAvailability();
      setBedStats(res.data.data || []);
      setError('');
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load bed stats');
      if (errorMsg) setError(errorMsg);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'patients') {
        await fetchPatients();
      } else if (activeTab === 'beds' || activeTab === 'admit') {
        await fetchBedStats();
      } else {
        await Promise.all([fetchBedStats(), fetchPatients()]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load: fetch key data
  useEffect(() => {
    fetchPatients();
    fetchBedStats();
  }, []);

  // Tab-based refresh
  useEffect(() => {
    if (activeTab === 'patients') fetchPatients();
    if (activeTab === 'beds' || activeTab === 'admit' || activeTab === 'overview') fetchBedStats();
  }, [activeTab]);

  const admitPatient = async () => {
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!admissionForm.firstName || !admissionForm.lastName || !admissionForm.email || !admissionForm.phone || !admissionForm.dateOfBirth) {
      setError('Please fill in all required fields (First Name, Last Name, Email, Phone, Date of Birth)');
      setLoading(false);
      return;
    }

    try {
      const res = await receptionistService.admitPatient(admissionForm);
      if (res?.data?.success) {
        alert('Patient admitted successfully');
        setAdmissionForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          age: '',
          dateOfBirth: '',
          gender: 'Male',
          bloodType: 'O+',
          address: '',
          ward: 'General',
          admissionReason: '',
          emergencyContact: { name: '', phone: '', relation: '' }
        });
        fetchPatients();
        fetchBedStats();
      } else {
        setError(res?.data?.message || 'Failed to admit patient');
      }
    } catch (err) {
      const apiError = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`${apiError} - Please ensure the selected ward has available beds and all data is valid.`);
    } finally {
      setLoading(false);
    }
  };

  const dischargePatient = async (id) => {
    if (!confirm('Confirm discharge?')) return;
    setLoading(true);
    try {
      await receptionistService.dischargePatient(id);
      fetchPatients();
      alert('Patient discharged');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to discharge patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900">
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 border-r border-teal-500 border-opacity-20 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg">
            <FaHospital className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">MediVibe</h2>
            <p className="text-xs text-teal-600">Receptionist Portal</p>
          </div>
        </div>

        <nav className="space-y-3 mb-8">
          {[
            { tab: 'overview', label: 'Overview', icon: FaHome },
            { tab: 'admit', label: 'Admit Patient', icon: FaUserPlus },
            { tab: 'patients', label: 'Patients', icon: FaUsers },
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

      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name.split(' ')[0]}!</h1>
            <p className="text-stone-400">Receptionist Dashboard</p>
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
                <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Total Patients</span>
                    <span className="text-white font-semibold">{patients.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Available Beds</span>
                    <span className="text-teal-400 font-semibold">{bedStats.reduce((sum, w) => sum + w.available, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admit' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Admit New Patient</h2>
            
            {/* Ward Availability Info */}
            {bedStats.length > 0 && (
              <div className="mb-6 p-4 bg-stone-800 border border-stone-700 rounded-lg">
                <p className="text-stone-400 text-sm font-semibold mb-3">Ward Bed Availability:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {bedStats.map((ward) => (
                    <div key={ward._id || ward.ward} className={`p-2 rounded text-center text-sm ${ward.available > 0 ? 'bg-teal-900 bg-opacity-50 border border-teal-600' : 'bg-red-900 bg-opacity-50 border border-red-600'}`}>
                      <p className="text-stone-300 text-xs">{ward.ward}</p>
                      <p className={`font-bold ${ward.available > 0 ? 'text-teal-400' : 'text-red-400'}`}>{ward.available}/{ward.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-600 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="First Name *" value={admissionForm.firstName} onChange={(e) => setAdmissionForm({ ...admissionForm, firstName: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="text" placeholder="Last Name *" value={admissionForm.lastName} onChange={(e) => setAdmissionForm({ ...admissionForm, lastName: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="email" placeholder="Email *" value={admissionForm.email} onChange={(e) => setAdmissionForm({ ...admissionForm, email: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="tel" placeholder="Phone *" value={admissionForm.phone} onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="number" min="0" placeholder="Age *" value={admissionForm.age} onChange={(e) => setAdmissionForm({ ...admissionForm, age: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="date" value={admissionForm.dateOfBirth} onChange={(e) => setAdmissionForm({ ...admissionForm, dateOfBirth: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" placeholder="Date of Birth *" />
                <select value={admissionForm.gender} onChange={(e) => setAdmissionForm({ ...admissionForm, gender: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white">
                  {['Male', 'Female', 'Other'].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={admissionForm.bloodType} onChange={(e) => setAdmissionForm({ ...admissionForm, bloodType: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={admissionForm.ward} onChange={(e) => setAdmissionForm({ ...admissionForm, ward: e.target.value })} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white">
                  {['ICU', 'General', 'Emergency', 'Pediatric', 'Orthopedic', 'Cardiac'].map((w) => {
                    const wardInfo = bedStats.find(b => b.ward === w);
                    const available = wardInfo?.available || 0;
                    return (
                      <option key={w} value={w} disabled={available === 0}>
                        {w} {available > 0 ? `(${available} available)` : '(No beds available)'}
                      </option>
                    );
                  })}
                </select>
                <input type="text" placeholder="Address" value={admissionForm.address} onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value })} className="col-span-2 bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="text" placeholder="Admission Reason" value={admissionForm.admissionReason} onChange={(e) => setAdmissionForm({ ...admissionForm, admissionReason: e.target.value })} className="col-span-2 bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="text" placeholder="Emergency Contact Name" value={admissionForm.emergencyContact.name} onChange={(e) => setAdmissionForm({ ...admissionForm, emergencyContact: { ...admissionForm.emergencyContact, name: e.target.value }})} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
                <input type="tel" placeholder="Emergency Contact Phone" value={admissionForm.emergencyContact.phone} onChange={(e) => setAdmissionForm({ ...admissionForm, emergencyContact: { ...admissionForm.emergencyContact, phone: e.target.value }})} className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <button onClick={admitPatient} disabled={loading} className={`w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2 rounded-lg transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {loading ? 'Admitting...' : 'Admit Patient'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Patient List</h2>
              <button onClick={fetchPatients} className="text-sm text-teal-600 hover:text-teal-700">Refresh</button>
            </div>
            <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-stone-200 text-sm">
                  <thead className="text-stone-400">
                    <tr>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Bed</th>
                      <th className="py-2 pr-4">Ward</th>
                      <th className="py-2 pr-4">Admitted</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-700/60">
                    {patients.map((p) => (
                      <tr key={p._id}>
                        <td className="py-3 pr-4">{p.firstName} {p.lastName}</td>
                        <td className="py-3 pr-4">{p.assignedBed?.bedNumber || 'N/A'}</td>
                        <td className="py-3 pr-4">{p.ward}</td>
                        <td className="py-3 pr-4">{new Date(p.admissionDate).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button onClick={() => dischargePatient(p._id)} className="text-sm text-red-400 hover:text-red-200">Discharge</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {patients.length === 0 && <p className="text-stone-400 py-4">No patients yet</p>}
              </div>
            </div>
          </div>
        )}

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
                      <span className="text-teal-400">Available</span>
                      <span className="text-teal-400 font-semibold">{stat.available}</span>
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

export default ReceptionistDashboard;
