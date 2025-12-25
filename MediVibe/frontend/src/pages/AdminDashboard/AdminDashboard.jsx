import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHospital, FaSignOutAlt, FaUsers, FaBed, FaChartBar, FaCog, FaHome, FaClipboardCheck, FaSync } from 'react-icons/fa';
import { adminService } from '../../services';
import { getDisplayableErrorMessage } from '../../utils/errorHandler';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [beds, setBeds] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshMessage, setRefreshMessage] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'doctor', phone: '' });
  const [bedForm, setBedForm] = useState({ bedNumber: '', ward: 'General', bedType: 'Standard', status: 'Available', dailyRate: 0 });
  const [reportResult, setReportResult] = useState(null);
  const [patients, setPatients] = useState([]);
  const [assignForm, setAssignForm] = useState({ patientId: '', doctorId: '', nurseId: '', ward: 'General', shiftDate: new Date().toISOString().slice(0, 10), shiftStart: '08:00', shiftEnd: '16:00', notes: '' });
  const isAssignDisabled = !assignForm.patientId || !assignForm.doctorId || !assignForm.nurseId || !assignForm.ward || !assignForm.shiftDate || !assignForm.shiftStart || !assignForm.shiftEnd;
  const [assignMessage, setAssignMessage] = useState('');
  const [patientStats, setPatientStats] = useState({ total: 0, admitted: 0, discharged: 0, critical: 0 });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchUsers = async () => {
    setError('');
    try {
      const res = await adminService.listUsers();
      console.log('Fetched users:', res.data.data);
      setUsers(res.data.data || []);
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load users');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchBeds = async () => {
    setError('');
    try {
      const res = await adminService.listBeds();
      setBeds(res.data.data || []);
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load beds');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchReports = async () => {
    setError('');
    try {
      const res = await adminService.getReportSummary();
      setReports(res.data.data || null);
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load reports');
      if (errorMsg) setError(errorMsg);
    }
  };

  const fetchPatients = async () => {
    setError('');
    try {
      const res = await adminService.listPatients();
      setPatients(res.data.data || []);
      
      // Calculate stats
      const total = res.data.data?.length || 0;
      const admitted = res.data.data?.filter(p => p.status === 'Admitted').length || 0;
      const discharged = res.data.data?.filter(p => p.status === 'Discharged').length || 0;
      const critical = res.data.data?.filter(p => p.status === 'Critical').length || 0;
      setPatientStats({ total, admitted, discharged, critical });
    } catch (err) {
      const errorMsg = getDisplayableErrorMessage(err, 'Failed to load patients');
      if (errorMsg) setError(errorMsg);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setRefreshMessage('');
    console.log('Starting refresh for tab:', activeTab);
    try {
      if (activeTab === 'overview') {
        console.log('Refreshing overview data...');
        await Promise.all([fetchUsers(), fetchBeds(), fetchReports(), fetchPatients()]);
      } else if (activeTab === 'users') {
        console.log('Refreshing users...');
        await fetchUsers();
      } else if (activeTab === 'beds') {
        console.log('Refreshing beds...');
        await fetchBeds();
      } else if (activeTab === 'reports') {
        console.log('Refreshing reports...');
        await fetchReports();
      } else if (activeTab === 'assignments' || activeTab === 'patients') {
        console.log('Refreshing assignments/patients...');
        await Promise.all([fetchUsers(), fetchPatients()]);
      }
      console.log('Refresh completed successfully');
      setRefreshMessage('✓ Data refreshed successfully');
      setTimeout(() => setRefreshMessage(''), 3000);
    } catch (err) {
      console.error('Refresh error:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchUsers();
      fetchBeds();
      fetchReports();
      fetchPatients();
    }
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'beds') fetchBeds();
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'assignments' || activeTab === 'patients') {
      fetchUsers();
      fetchPatients();
    }
  }, [activeTab]);

  const adminStats = [
    { title: 'Total Users', value: users.length || '—', icon: FaUsers, color: 'bg-teal-600' },
    { title: 'Total Beds', value: beds.length || '—', icon: FaBed, color: 'bg-teal-600' },
    { title: 'Occupancy Rate', value: reports?.beds ? `${Math.round((reports.beds.occupied / Math.max(reports.beds.total, 1)) * 100)}%` : '—', icon: FaChartBar, color: 'bg-green-500' },
    { title: 'Active Patients', value: patientStats.admitted || '—', icon: FaUsers, color: 'bg-teal-600' },
    { title: 'Total Patients', value: patientStats.total || '—', icon: FaUsers, color: 'bg-teal-600' },
    { title: 'Critical Cases', value: patientStats.critical || '—', icon: FaChartBar, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 p-6 overflow-y-auto border-r border-teal-500 border-opacity-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg">
            <FaHospital className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">MediVibe</h2>
            <p className="text-xs text-teal-600">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-3 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaHome /> Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'users'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaUsers /> Manage Users
          </button>
          <button
            onClick={() => setActiveTab('beds')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'beds'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaBed /> Manage Beds
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'reports'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaChartBar /> Reports
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'assignments'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaClipboardCheck /> Assign Patients
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'patients'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FaUsers /> Manage Patients
          </button>
        </nav>

        {/* User Info */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-xs text-teal-600">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name.split(' ')[0]}!</h1>
            <p className="text-stone-400">Administrator Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${loading ? 'bg-teal-500 text-white opacity-60 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
              title="Refresh data"
            >
              <FaSync className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {refreshMessage && (
          <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-500 text-green-200 rounded-lg text-sm">
            {refreshMessage}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adminStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 hover:border-opacity-60 rounded-xl p-6 transition transform hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="text-2xl text-white" />
                      </div>
                    </div>
                    <p className="text-stone-400 text-sm font-semibold mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Database</span>
                    <span className="text-green-400 font-semibold">✓ Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">API Server</span>
                    <span className="text-green-400 font-semibold">✓ Running</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Real-Time Updates</span>
                    <span className="text-green-400 font-semibold">✓ Active</span>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2 rounded-lg transition mb-3"
                >
                  Add New User
                </button>
                <button
                  onClick={async () => {
                    setLoading(true);
                    setError('');
                    try {
                      const res = await adminService.generateReport('occupancy');
                      setReportResult(res.data.data);
                      setActiveTab('reports');
                    } catch (err) {
                      setError(err.response?.data?.message || 'Failed to generate report');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2 rounded-lg transition"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Users</h3>
                  <button onClick={fetchUsers} className="text-sm text-teal-400 hover:text-teal-200">Refresh</button>
                </div>
                {error && <p className="text-red-400 mb-3">{error}</p>}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-stone-200 text-sm">
                    <thead className="text-stone-400">
                      <tr>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-700/60">
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="py-3 pr-4">{u.name}</td>
                          <td className="py-3 pr-4 text-stone-400">{u.email}</td>
                          <td className="py-3 pr-4 uppercase text-xs">{u.role}</td>
                          <td className="py-3 pr-4">{u.isActive ? <span className="text-teal-400">Active</span> : <span className="text-red-400">Disabled</span>}</td>
                          <td className="py-3">
                            <button
                              onClick={async () => {
                                setLoading(true);
                                try {
                                  await adminService.updateUserStatus(u._id, !u.isActive);
                                  fetchUsers();
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="text-sm text-teal-300 hover:text-teal-100"
                            >
                              {u.isActive ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <p className="text-stone-400 py-4">No users yet.</p>}
                </div>
              </div>

              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
                <div className="space-y-3">
                  {['name','email','password','phone'].map((field) => (
                    <input
                      key={field}
                      type={field === 'password' ? 'password' : 'text'}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={userForm[field] || ''}
                      onChange={(e) => setUserForm({ ...userForm, [field]: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  ))}
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="patient">Patient</option>
                  </select>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      setError('');
                      try {
                        await adminService.createUser(userForm);
                        setUserForm({ name: '', email: '', password: '', role: 'staff', phone: '' });
                        fetchUsers();
                      } catch (err) {
                        setError(err.response?.data?.message || 'Failed to create user');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2 rounded-lg transition"
                  >
                    Save User
                  </button>
                  {loading && <p className="text-xs text-stone-400">Working...</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Beds Tab */}
        {activeTab === 'beds' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Bed Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Beds</h3>
                  <button onClick={fetchBeds} className="text-sm text-teal-400 hover:text-teal-200">Refresh</button>
                </div>
                {error && <p className="text-red-400 mb-3">{error}</p>}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-stone-200 text-sm">
                    <thead className="text-stone-400">
                      <tr>
                        <th className="py-2 pr-4">Bed #</th>
                        <th className="py-2 pr-4">Ward</th>
                        <th className="py-2 pr-4">Type</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-700/60">
                      {beds.map((b) => (
                        <tr key={b._id}>
                          <td className="py-3 pr-4">{b.bedNumber}</td>
                          <td className="py-3 pr-4 text-stone-300">{b.ward}</td>
                          <td className="py-3 pr-4 text-stone-400">{b.bedType}</td>
                          <td className="py-3 pr-4">{b.status}</td>
                          <td className="py-3">
                            <select
                              value={b.status}
                              onChange={async (e) => {
                                setLoading(true);
                                try {
                                  await adminService.updateBedStatus(b._id, e.target.value);
                                  fetchBeds();
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-sm"
                            >
                              {['Available','Occupied','Maintenance','Cleaning'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {beds.length === 0 && <p className="text-stone-400 py-4">No beds yet.</p>}
                </div>
              </div>

              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Add Bed</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Bed Number"
                    value={bedForm.bedNumber}
                    onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <select
                    value={bedForm.ward}
                    onChange={(e) => setBedForm({ ...bedForm, ward: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {['ICU','General','Emergency','Pediatric','Orthopedic','Cardiac'].map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                  <select
                    value={bedForm.bedType}
                    onChange={(e) => setBedForm({ ...bedForm, bedType: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {['Standard','Semi-Deluxe','Deluxe','ICU Standard','ICU Advanced'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    placeholder="Daily Rate"
                    value={bedForm.dailyRate}
                    onChange={(e) => setBedForm({ ...bedForm, dailyRate: Number(e.target.value) })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={async () => {
                      setLoading(true);
                      setError('');
                      try {
                        await adminService.createBed(bedForm);
                        setBedForm({ bedNumber: '', ward: 'General', bedType: 'Standard', status: 'Available', dailyRate: 0 });
                        fetchBeds();
                      } catch (err) {
                        setError(err.response?.data?.message || 'Failed to create bed');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2 rounded-lg transition"
                  >
                    Save Bed
                  </button>
                  {loading && <p className="text-xs text-stone-400">Working...</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Reports & Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Summary</h3>
                  <button onClick={fetchReports} className="text-sm text-teal-400 hover:text-teal-200">Refresh</button>
                </div>
                {reports ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-stone-900/60 border border-stone-700">
                      <p className="text-stone-400 text-sm">Total Beds</p>
                      <p className="text-3xl text-white font-bold">{reports.beds.total}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-stone-900/60 border border-stone-700">
                      <p className="text-stone-400 text-sm">Available</p>
                      <p className="text-3xl text-teal-400 font-bold">{reports.beds.available}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-stone-900/60 border border-stone-700">
                      <p className="text-stone-400 text-sm">Occupied</p>
                      <p className="text-3xl text-teal-600 font-bold">{reports.beds.occupied}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-400">No data yet.</p>
                )}

                {reportResult && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg text-white font-semibold">Generated Report</h4>
                      <span className="text-xs text-stone-400">{reportResult.generatedAt}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-stone-200 text-sm">
                        <thead className="text-stone-400">
                          <tr>
                            <th className="py-2 pr-4">Ward</th>
                            <th className="py-2 pr-4">Total</th>
                            <th className="py-2 pr-4">Available</th>
                            <th className="py-2 pr-4">Occupied</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-700/60">
                          {reportResult.summary.map((row) => (
                            <tr key={row.ward}>
                              <td className="py-2 pr-4">{row.ward}</td>
                              <td className="py-2 pr-4">{row.total}</td>
                              <td className="py-2 pr-4 text-teal-400">{row.available}</td>
                              <td className="py-2 pr-4 text-teal-600">{row.occupied}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Generate Report</h3>
                <p className="text-stone-300 text-sm mb-4">Generate occupancy snapshot by ward.</p>
                <button
                  onClick={async () => {
                    setLoading(true);
                    setError('');
                    try {
                      const res = await adminService.generateReport('occupancy');
                      setReportResult(res.data.data);
                    } catch (err) {
                      setError(err.response?.data?.message || 'Failed to generate report');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2 rounded-lg transition"
                >
                  Generate Occupancy Report
                </button>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                {loading && <p className="text-xs text-stone-400 mt-2">Working...</p>}
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Assign Patient to Doctor & Nurse</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6 lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-stone-400 text-sm mb-1">Patient</p>
                    <select
                      value={assignForm.patientId}
                      onChange={(e) => setAssignForm({ ...assignForm, patientId: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="">Select patient</option>
                      {patients.map((p) => (
                        <option key={p._id} value={p._id}>{p.firstName} {p.lastName} • {p.ward || 'No ward'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm mb-1">Ward</p>
                    <select
                      value={assignForm.ward}
                      onChange={(e) => setAssignForm({ ...assignForm, ward: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      {['ICU','General','Emergency','Pediatric','Orthopedic','Cardiac'].map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm mb-1">Doctor</p>
                    <select
                      value={assignForm.doctorId}
                      onChange={(e) => setAssignForm({ ...assignForm, doctorId: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="">Select doctor</option>
                      {users.filter((u) => u.role === 'doctor').map((u) => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm mb-1">Nurse</p>
                    <select
                      value={assignForm.nurseId}
                      onChange={(e) => setAssignForm({ ...assignForm, nurseId: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="">Select nurse</option>
                      {users.filter((u) => u.role === 'nurse').map((u) => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm mb-1">Shift Date</p>
                    <input
                      type="date"
                      value={assignForm.shiftDate}
                      onChange={(e) => setAssignForm({ ...assignForm, shiftDate: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-stone-400 text-sm mb-1">Start</p>
                      <input
                        type="time"
                        value={assignForm.shiftStart}
                        onChange={(e) => setAssignForm({ ...assignForm, shiftStart: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div>
                      <p className="text-stone-400 text-sm mb-1">End</p>
                      <input
                        type="time"
                        value={assignForm.shiftEnd}
                        onChange={(e) => setAssignForm({ ...assignForm, shiftEnd: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-stone-400 text-sm mb-1">Notes</p>
                    <textarea
                      value={assignForm.notes}
                      onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      rows={3}
                      placeholder="Optional notes for duty"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={async () => {
                      // Basic client-side validation before hitting API
                      if (isAssignDisabled) {
                        setError('Please select patient, ward, doctor, nurse, and provide shift date/time.');
                        return;
                      }

                      setLoading(true);
                      setError('');
                      setAssignMessage('');
                      try {
                        const payload = {
                          patientId: assignForm.patientId,
                          doctorId: assignForm.doctorId,
                          nurseId: assignForm.nurseId,
                          ward: assignForm.ward,
                          shiftDate: assignForm.shiftDate,
                          shiftStart: assignForm.shiftStart,
                          shiftEnd: assignForm.shiftEnd,
                          notes: assignForm.notes
                        };
                        console.log('Assigning with payload:', payload);
                        const res = await adminService.assignPatient(payload);
                        console.log('Assignment response:', res);
                        if (res?.data?.success) {
                          setAssignMessage(res.data.message || 'Assignment saved successfully');
                          // Reset form after success
                          setTimeout(() => {
                            setAssignForm({ patientId: '', doctorId: '', nurseId: '', ward: 'General', shiftDate: new Date().toISOString().slice(0, 10), shiftStart: '08:00', shiftEnd: '16:00', notes: '' });
                            setAssignMessage('');
                          }, 2000);
                          fetchPatients();
                        } else {
                          setError(res?.data?.message || 'Failed to assign patient');
                        }
                      } catch (err) {
                        console.error('Assignment error:', err.response?.data || err.message);
                        const apiMsg = err.response?.data?.message;
                        const apiError = err.response?.data?.error;
                        setError(apiMsg || apiError || err.message || 'Failed to assign patient');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={isAssignDisabled || loading}
                    className={`bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2 rounded-lg transition ${ (isAssignDisabled || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    Save Assignment
                  </button>
                  {loading && <p className="text-xs text-stone-400">Working...</p>}
                  {assignMessage && <p className="text-xs text-teal-600">{assignMessage}</p>}
                </div>
              </div>

              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Admitted Patients</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {patients.map((p) => (
                    <div key={p._id} className="p-3 rounded-lg bg-stone-900/60 border border-stone-700">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-semibold">{p.firstName} {p.lastName}</p>
                        <span className="text-xs text-stone-400">{p.ward || 'No ward'}</span>
                      </div>
                      <p className="text-stone-300 text-sm">Doctor: {p.doctor?.name || 'Unassigned'}</p>
                      <p className="text-stone-300 text-sm">Bed: {p.assignedBed?.bedNumber || 'N/A'}</p>
                    </div>
                  ))}
                  {patients.length === 0 && <p className="text-stone-400">No patients found.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patients Management Tab */}
        {activeTab === 'patients' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Patient Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-4">
                <p className="text-stone-400 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-white">{patientStats.total}</p>
              </div>
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-4">
                <p className="text-stone-400 text-sm">Admitted</p>
                <p className="text-3xl font-bold text-teal-400">{patientStats.admitted}</p>
              </div>
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-4">
                <p className="text-stone-400 text-sm">Critical</p>
                <p className="text-3xl font-bold text-red-400">{patientStats.critical}</p>
              </div>
              <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-4">
                <p className="text-stone-400 text-sm">Discharged</p>
                <p className="text-3xl font-bold text-teal-600">{patientStats.discharged}</p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-stone-800 bg-opacity-40 border border-teal-500 border-opacity-30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Patient List</h3>
                <button onClick={fetchPatients} className="text-sm text-teal-400 hover:text-teal-200">Refresh</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-stone-200 text-sm">
                  <thead className="text-stone-400">
                    <tr>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Ward</th>
                      <th className="py-2 pr-4">Doctor</th>
                      <th className="py-2 pr-4">Bed</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-700/60">
                    {patients.map((p) => (
                      <tr key={p._id}>
                        <td className="py-3 pr-4 font-semibold">{p.firstName} {p.lastName}</td>
                        <td className="py-3 pr-4 text-stone-300">{p.ward || '—'}</td>
                        <td className="py-3 pr-4 text-stone-300">{p.doctor?.name || 'Unassigned'}</td>
                        <td className="py-3 pr-4 text-stone-300">{p.assignedBed?.bedNumber || 'N/A'}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.status === 'Admitted' ? 'bg-teal-500/20 text-teal-300' :
                            p.status === 'Critical' ? 'bg-red-500/20 text-red-300' :
                            p.status === 'Discharged' ? 'bg-stone-500/20 text-stone-300' :
                            'bg-teal-500/20 text-teal-600'
                          }`}>{p.status}</span>
                        </td>
                        <td className="py-3">
                          {p.status === 'Admitted' || p.status === 'Critical' ? (
                            <button
                              onClick={async () => {
                                if (!confirm('Discharge patient?')) return;
                                setLoading(true);
                                try {
                                  await adminService.dischargePatient(p._id);
                                  fetchPatients();
                                } catch (err) {
                                  setError(err.response?.data?.message || 'Failed to discharge patient');
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="text-sm text-red-400 hover:text-red-200"
                            >
                              Discharge
                            </button>
                          ) : (
                            <span className="text-stone-500 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {patients.length === 0 && <p className="text-stone-400 py-4">No patients found.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
