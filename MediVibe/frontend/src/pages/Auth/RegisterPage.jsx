import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaStethoscope, FaShieldAlt } from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'staff',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        specialization: formData.specialization,
      });

      if (response.data.success) {
        // Redirect to login after successful registration
        navigate('/login', { 
          state: { message: 'Registration successful! Please login with your credentials.' } 
        });
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <FaUser className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600 text-sm">Join MediVibe Hospital Management System</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Full Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-teal-600" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Email Address *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-teal-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@hospital.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-3 text-teal-600" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Account Type *</label>
              <div className="relative">
                <FaShieldAlt className="absolute left-3 top-3 text-teal-600" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition appearance-none"
                >
                  <option value="staff">Staff Member</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* Specialization (for doctors) */}
            {formData.role === 'doctor' && (
              <div className="relative">
                <label className="block text-slate-700 text-sm font-semibold mb-2">Specialization</label>
                <div className="relative">
                  <FaStethoscope className="absolute left-3 top-3 text-teal-600" />
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology, Surgery, Pediatrics"
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-teal-600" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Confirm Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-teal-600" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-teal-500/50 mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-teal-600 hover:text-teal-700 font-semibold transition"
            >
              Login Here
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
