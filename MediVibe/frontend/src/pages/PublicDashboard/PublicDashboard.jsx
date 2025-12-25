import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHospital,
  FaUserPlus,
  FaSignInAlt,
  FaBed,
  FaUsers,
  FaHeartbeat,
  FaClipboardCheck,
  FaUserShield
} from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';
import hospitalBg from '../../assets/hospital.png';
import { bedService } from '../../services';

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [wardStats, setWardStats] = useState([]);
  const [liveStats, setLiveStats] = useState({
    totalBeds: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    maintenanceBeds: 0,
    cleaningBeds: 0,
  });
  const [bedError, setBedError] = useState('');
  const [loadingBeds, setLoadingBeds] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const loadBedData = async () => {
      setLoadingBeds(true);
      setBedError('');
      try {
        const res = await bedService.getBedAvailability();
        const data = res.data?.data || {};

        setWardStats(data.wards || []);
        setLiveStats({
          totalBeds: data.totals?.totalBeds || 0,
          availableBeds: data.totals?.availableBeds || 0,
          occupiedBeds: data.totals?.occupiedBeds || 0,
          maintenanceBeds: data.totals?.maintenanceBeds || 0,
          cleaningBeds: data.totals?.cleaningBeds || 0,
        });
      } catch (error) {
        setBedError(error.response?.data?.message || 'Unable to load live bed data right now.');
      } finally {
        setLoadingBeds(false);
      }
    };

    loadBedData();
  }, []);

  const statCards = [
    { icon: FaBed, label: 'Total beds', value: loadingBeds ? '—' : liveStats.totalBeds },
    { icon: FaHeartbeat, label: 'Available today', value: loadingBeds ? '—' : liveStats.availableBeds },
    { icon: FaUsers, label: 'Currently occupied', value: loadingBeds ? '—' : liveStats.occupiedBeds },
  ];

  const strengths = [
    { title: '24/7 visibility', desc: 'Clear occupancy and admission status at a glance.', icon: FaClipboardCheck },
    { title: 'Role-based access', desc: 'Teams see only what they need to act quickly.', icon: FaUserShield },
    { title: 'Safe & compliant', desc: 'Built with data privacy and audit trails in mind.', icon: FaHospital },
  ];

  const steps = [
    { title: 'Check availability', desc: 'See real-time bed inventory across wards.' },
    { title: 'Admit confidently', desc: 'Allocate beds with clear protocols and notes.' },
    { title: 'Track and update', desc: 'Keep teams aligned on discharges and transfers.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
              <FaHospital className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">MediVibe</h1>
              <p className="text-xs text-slate-500">Hospital bed management</p>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('live-beds')}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              Live Beds
            </button>
            <button
              onClick={() => scrollToSection('wards')}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              Wards
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              About
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <FaSignInAlt /> Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-teal-600 text-teal-700 font-medium bg-white hover:bg-teal-50 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <FaUserPlus /> Register
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <section className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-teal-700 font-semibold text-sm tracking-wide uppercase">Built for modern hospitals</p>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Clear, calm bed management that feels <span className="bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">familiar.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Inspired by trusted hospital systems, MediVibe keeps teams aligned with real-time bed visibility, simple actions, and a reassuring, human-first design.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                Login to dashboard
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-7 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold bg-white hover:bg-slate-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                Create account
              </button>
            </div>
            <div className="flex gap-8 pt-4 border-t border-slate-200">
              <div className="group">
                <p className="font-bold text-2xl text-slate-900 group-hover:text-teal-600 transition-colors">99.9%</p>
                <p className="text-sm text-slate-600">Uptime guaranteed</p>
              </div>
              <div className="group">
                <p className="font-bold text-2xl text-slate-900 group-hover:text-teal-600 transition-colors">4+</p>
                <p className="text-sm text-slate-600">Role-based access</p>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-slate-100 rounded-2xl blur-2xl opacity-60"></div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <img src={hospitalBg} alt="Hospital corridor" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <section id="live-beds" className="py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {statCards.map(({ icon: Icon, label, value }) => (
              <div key={label} className="group rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 group-hover:from-teal-100 group-hover:to-teal-200 transition-all duration-300">
                  <Icon className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{label}</p>
                  <p className="text-3xl font-bold text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="wards" className="py-20 border-t border-slate-200">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Our Wards</h2>
            <p className="text-slate-600 text-lg">Comprehensive bed management across all hospital departments</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingBeds && <p className="text-slate-600">Loading live ward data...</p>}
            {!loadingBeds && bedError && <p className="text-red-600">{bedError}</p>}
            {!loadingBeds && !bedError && wardStats.length === 0 && (
              <p className="text-slate-600">No bed data available yet.</p>
            )}
            {!loadingBeds && !bedError && wardStats.map((ward) => (
              <div key={ward.ward} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{ward.ward} Ward</h3>
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold">{ward.total} beds</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">Live occupancy and turnover tracking for this department.</p>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-slate-600">{ward.available} Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                    <span className="text-slate-600">{ward.occupied} Occupied</span>
                  </div>
                  {ward.maintenance > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span className="text-slate-600">{ward.maintenance} Maintenance</span>
                    </div>
                  )}
                  {ward.cleaning > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-teal-200"></span>
                      <span className="text-slate-600">{ward.cleaning} Cleaning</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="py-20 border-t border-slate-200">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Why MediVibe works</h2>
            <p className="text-slate-600 text-lg">Built with the features healthcare teams need to manage beds efficiently and safely</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {strengths.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="group relative rounded-2xl border border-slate-200 bg-white p-8 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 flex items-center justify-center group-hover:from-teal-100 group-hover:to-teal-200 transition-all duration-300">
                  <Icon className="text-xl" />
                </div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-2">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">How it works</h2>
            <p className="text-slate-600 text-lg">A simple workflow for bed management that teams can rely on</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ title, desc }, idx) => (
              <div key={title} className="group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                  {idx + 1}
                </div>
                <div className="relative">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mt-2">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 border-t border-slate-200">
          <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-slate-50 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <p className="text-sm text-teal-700 font-semibold tracking-wide uppercase">Ready to get started</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">See the dashboard <span className="bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">your team needs.</span></h3>
              <p className="text-slate-600 mt-3 leading-relaxed">Log in to view your live data or create an account to start managing beds with confidence.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-1 whitespace-nowrap"
              >
                Go to login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-7 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold bg-white hover:bg-slate-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1 whitespace-nowrap"
              >
                Create account
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PublicDashboard;
