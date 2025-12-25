import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital, FaHeart } from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';

const OurStoryPage = () => {
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
            <div className="inline-block bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-full mb-4">
              <FaHeart className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Our Story</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-teal-700 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
            <p>
              MediVibe was created with a simple but meaningful idea—to make hospital operations smarter, faster, and more transparent.
            </p>

            <p>
              During the development of this project, it became clear that one of the most common challenges hospitals face is managing bed availability efficiently while coordinating doctors, nurses, and support staff. Delays in information often lead to delays in care. MediVibe was built to address this gap through technology.
            </p>

            <p>
              This platform is designed and developed by <span className="text-teal-700 font-semibold">Abhishek Das</span>, with a strong focus on real-world hospital workflows and modern web technologies. Every feature—from real-time bed tracking to role-based dashboards—was thoughtfully designed to reflect how hospitals actually operate, not just how systems are typically imagined.
            </p>

            <p>
              As a developer, Abhishek aimed to build more than just a project. MediVibe represents a commitment to clean design, scalable architecture, and user-centered experience, combining React.js and Node.js to deliver a responsive, interactive, and professional healthcare platform.
            </p>

            <p className="text-teal-700 font-semibold">
              MediVibe is a step toward demonstrating how technology can play a meaningful role in improving healthcare efficiency—by reducing manual effort, improving coordination, and supporting better patient outcomes.
            </p>
          </div>

          <div className="mt-10 p-6 bg-teal-500/10 border border-teal-500/20 rounded-xl">
            <p className="text-center text-slate-600 italic">
              "Building technology that matters, one line of code at a time."
            </p>
            <p className="text-center text-teal-700 font-semibold mt-2">— Abhishek Das</p>
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => navigate('/contact-info')}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              Get in Touch
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

export default OurStoryPage;
