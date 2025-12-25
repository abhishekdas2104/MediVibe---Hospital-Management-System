import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirect based on user role
        const roleRoutes = {
          admin: '/admin-dashboard',
          doctor: '/doctor-dashboard',
          nurse: '/nurse-dashboard',
          receptionist: '/receptionist-dashboard',
          staff: '/staff-dashboard'
        };
        navigate(roleRoutes[result.user.role] || '/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card with glass effect */}
        <div className="backdrop-blur-xl bg-white border border-teal-200 border-opacity-60 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg w-fit mx-auto mb-4">
              <FaLock className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600 text-sm">MediVibe Hospital Management System</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-900 bg-opacity-50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 text-sm">
              ✓ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              ✗ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-teal-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@hospital.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-teal-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-teal-500/50 mt-6 flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : (
                <>
                  Login <FaArrowRight className="text-lg" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-slate-600 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-teal-600 hover:text-teal-700 font-semibold transition"
            >
              Register Here
            </button>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-slate-600 text-xs font-semibold mb-2">Demo Credentials:</p>
            <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-xs text-slate-700">
              <p>👨‍💼 Admin: <span className="text-teal-600 font-medium">admin@medivibe.com</span> / admin123</p>
              <p>👨‍⚕️ Doctor: <span className="text-teal-600 font-medium">sarah.johnson@medivibe.com</span> / doctor123</p>
              <p>👩‍⚕️ Nurse: <span className="text-teal-600 font-medium">emily.davis@medivibe.com</span> / nurse123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Secure Login • All data is encrypted and protected
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
