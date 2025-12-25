import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital } from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
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
        <div className="backdrop-blur-0 bg-white border border-slate-200 rounded-2xl shadow-lg p-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">About MediVibe</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-teal-700 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
            <p>
              MediVibe is a modern hospital management platform designed to simplify and optimize one of the most critical challenges in healthcare—real-time bed availability and patient flow management.
            </p>

            <p>
              In many hospitals, delays in patient admissions and discharges occur due to fragmented bed tracking and manual coordination. MediVibe addresses this problem by providing a centralized, real-time system that enables hospitals to monitor bed occupancy, manage patient assignments, and coordinate staff responsibilities efficiently.
            </p>

            <p>
              Built with a strong focus on clarity, speed, and usability, MediVibe delivers role-based dashboards for hospital staff, doctors, nurses, and receptionists—ensuring that every user sees only what is relevant to their responsibilities. From live public bed availability to internal patient care workflows, the platform supports informed decision-making at every level.
            </p>

            <p>
              MediVibe combines intuitive design, interactive dashboards, and real-time data updates to create a seamless hospital operations experience. With a professional, dark-themed interface and smooth interactive elements, the platform is designed to feel both powerful and approachable.
            </p>

            <p className="text-teal-700 font-semibold">
              At its core, MediVibe aims to help hospitals operate smarter—reducing delays, improving coordination, and enabling faster, more efficient patient care.
            </p>
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/developer')}
              className="px-8 py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition"
            >
              Developer
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

      <Footer />
    </div>
  );
};

export default AboutPage;
