import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital, FaEnvelope, FaGithub, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';

const ContactInfoPage = () => {
  const navigate = useNavigate();

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
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="backdrop-blur-xl bg-white bg-opacity-90 border border-teal-500 border-opacity-30 rounded-2xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Contact Info</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-teal-700 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-700 text-lg leading-relaxed">
              Whether you have questions, feedback, or ideas to improve MediVibe, I'd be happy to connect. This project reflects a passion for building meaningful, real-world solutions through technology, and thoughtful discussions are always welcome.
            </p>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 hover:border-opacity-60 transition">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Name</p>
                  <p className="text-slate-900 text-xl font-bold">Abhishek Das</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 hover:border-opacity-60 transition">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Email</p>
                  <a
                    href="mailto:abhikamailhai@gmail.com"
                    className="text-teal-700 text-xl font-semibold hover:text-teal-800 transition"
                  >
                    abhikamailhai@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 hover:border-opacity-60 transition">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg">
                  <FaGithub className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold">GitHub</p>
                  <a
                    href="https://github.com/abhishekdas2104"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 text-xl font-semibold hover:text-teal-800 transition"
                  >
                    github.com/abhishekdas2104
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 hover:border-opacity-60 transition">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Address</p>
                  <p className="text-slate-900 text-xl font-bold">Lovely Professional University</p>
                  <p className="text-slate-700">Jalandhar, Punjab</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gradient-to-r from-teal-500/10 to-teal-400/10 border border-teal-500/20 rounded-xl text-center">
            <p className="text-slate-700 text-lg mb-4">
              Let's build something amazing together!
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:abhikamailhai@gmail.com"
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                Send Email
              </a>
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

export default ContactInfoPage;
