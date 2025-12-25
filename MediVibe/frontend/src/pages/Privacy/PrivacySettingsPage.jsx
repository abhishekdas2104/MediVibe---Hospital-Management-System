import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital, FaShieldAlt, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';

const PrivacySettingsPage = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Header */}
      <div className="border-b border-teal-500/20 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-700 hover:text-teal-600 transition"
          >
            <FaArrowLeft /> Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg">
              <FaHospital className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
              MediVibe
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="backdrop-blur-xl bg-white bg-opacity-90 border border-teal-500 border-opacity-30 rounded-2xl shadow-2xl p-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-full mb-4">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Privacy Settings</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-teal-700 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-700 text-lg">
              Your privacy and data security are our top priorities
            </p>
          </div>

          {/* Privacy Policy */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-teal-600 mb-6">Privacy Policy</h2>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6">
                <h3 className="text-slate-900 font-semibold text-lg mb-3 flex items-center gap-2">
                  <FaLock className="text-teal-600" /> Data Collection
                </h3>
                <p>
                  MediVibe collects only essential information required for hospital operations: user authentication details (name, email, password), role assignments, patient admission records, bed occupancy data, and medical care notes. We do not collect unnecessary personal data or browsing behavior.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6">
                <h3 className="text-slate-900 font-semibold text-lg mb-3 flex items-center gap-2">
                  <FaUserShield className="text-teal-600" /> Data Protection
                </h3>
                <p>
                  All passwords are encrypted using bcrypt with salt rounds, ensuring they cannot be reversed or viewed even by administrators. Authentication uses JWT (JSON Web Tokens) with secure expiration. Database connections are secured, and all API requests require valid authentication tokens.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6">
                <h3 className="text-slate-900 font-semibold text-lg mb-3 flex items-center gap-2">
                  <FaEye className="text-teal-600" /> Data Usage
                </h3>
                <p>
                  Your data is used exclusively for hospital management purposes: coordinating bed availability, managing patient admissions, tracking care assignments, and generating operational reports. We do not sell, rent, or share your data with third parties for marketing purposes.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6">
                <h3 className="text-slate-900 font-semibold text-lg mb-3 flex items-center gap-2">
                  <FaShieldAlt className="text-teal-600" /> Your Rights
                </h3>
                <p>
                  You have the right to access your personal data, request corrections, or request account deletion. Contact our support team at abhikamailhai@gmail.com to exercise these rights. Account deletion will remove all associated data within 30 days, except records required for legal compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Settings Controls */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-teal-600 mb-6">Privacy Controls</h2>
            <div className="space-y-4">
              {/* Notifications */}
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 font-semibold mb-1">System Notifications</h3>
                  <p className="text-slate-600 text-sm">Receive alerts about bed updates and patient assignments</p>
                </div>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    showNotifications ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      showNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Profile Visibility */}
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 font-semibold mb-1">Profile Visibility</h3>
                  <p className="text-slate-600 text-sm">Allow other staff members to view your contact information</p>
                </div>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    showProfile ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      showProfile ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Data Sharing */}
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 font-semibold mb-1">Anonymous Analytics</h3>
                  <p className="text-slate-600 text-sm">Help improve MediVibe by sharing anonymous usage data</p>
                </div>
                <button
                  onClick={() => setDataSharing(!dataSharing)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    dataSharing ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      dataSharing ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
              <p className="text-slate-700 text-sm">
                💡 <strong>Note:</strong> These settings are demonstration toggles. In a production environment, changes would be saved to your account preferences and synchronized across sessions.
              </p>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-teal-600 mb-6">Security Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-5">
                <div className="text-2xl mb-2">🔐</div>
                <h4 className="text-slate-900 font-semibold mb-2">Strong Passwords</h4>
                <p className="text-slate-700 text-sm">Use passwords with 8+ characters, mixing letters, numbers, and symbols</p>
              </div>
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-5">
                <div className="text-2xl mb-2">🚪</div>
                <h4 className="text-slate-900 font-semibold mb-2">Logout When Done</h4>
                <p className="text-slate-700 text-sm">Always logout from shared or public computers to protect your account</p>
              </div>
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-5">
                <div className="text-2xl mb-2">📧</div>
                <h4 className="text-slate-900 font-semibold mb-2">Verify Emails</h4>
                <p className="text-slate-700 text-sm">Be cautious of phishing attempts. We never ask for passwords via email</p>
              </div>
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-5">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="text-slate-900 font-semibold mb-2">Regular Updates</h4>
                <p className="text-slate-700 text-sm">Keep your browser updated for the latest security patches</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-teal-900/20 to-teal-800/20 border border-teal-500/30 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Questions About Privacy?</h3>
            <p className="text-slate-700 mb-6">
              If you have concerns about your data or privacy practices, contact us directly.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:abhikamailhai@gmail.com?subject=Privacy Inquiry - MediVibe"
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                Contact Support
              </a>
              <button
                onClick={() => navigate('/help-centre')}
                className="px-8 py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition"
              >
                Help Centre
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacySettingsPage;
