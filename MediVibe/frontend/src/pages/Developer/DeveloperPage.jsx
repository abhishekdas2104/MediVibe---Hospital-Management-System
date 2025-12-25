import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital, FaCode, FaUniversity, FaLaptopCode, FaHeart, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';

const DeveloperPage = () => {
  const navigate = useNavigate();

  // We try multiple srcs to be resilient. Preferred path is /abhi.jpeg in frontend/public
  const [imgSrc, setImgSrc] = useState('/abhi.jpeg');
  const fallbacks = [
    '/abhi.jpeg',
    '/images/abhi.jpeg',
    '/assets/abhi.jpeg'
  ];

  const handleImgError = () => {
    const idx = fallbacks.indexOf(imgSrc);
    const next = fallbacks[idx + 1];
    if (next) setImgSrc(next);
    // if no more fallbacks, we'll show the initials block
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-50">
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
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Developer of MediVibe</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-teal-700 mx-auto rounded-full"></div>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <img
                src={imgSrc}
                alt="Abhishek Das"
                className="w-40 h-40 rounded-full object-cover border-4 border-teal-500/40 shadow-xl"
                onError={handleImgError}
              />
              {/* Fallback initials if image not found after attempts */}
              {imgSrc === fallbacks[fallbacks.length - 1] && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-teal-900/30 border border-teal-500/30">
                  <span className="text-3xl text-teal-600 font-bold">AD</span>
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-slate-900">Abhishek Das</h2>
            <div className="mt-2 text-slate-700 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2"><FaUniversity className="text-teal-600" /><span>BTech CSE Student</span></div>
              <div className="flex items-center gap-2"><FaLaptopCode className="text-teal-600" /><span>Fullstack Developer</span></div>
              <div className="flex items-center gap-2"><FaUniversity className="text-teal-600" /><span>Lovely Professional University</span></div>
            </div>

            <p className="mt-6 text-slate-700 text-center max-w-2xl">
              Passionate about coding and crafting web experiences. I love building fast, scalable, and user-friendly websites and apps that solve real problems.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-80 border border-teal-500/20 rounded-xl p-5 text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <h4 className="text-slate-900 font-semibold mb-1">Stack</h4>
                <p className="text-slate-700 text-sm">React, Node.js, Express, MongoDB</p>
              </div>
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-80 border border-teal-500/20 rounded-xl p-5 text-center">
                <div className="text-2xl mb-2">🎨</div>
                <h4 className="text-slate-900 font-semibold mb-1">UI Craft</h4>
                <p className="text-slate-700 text-sm">Clean, modern, and responsive interfaces</p>
              </div>
              <div className="backdrop-blur-xl bg-slate-100 bg-opacity-80 border border-teal-500/20 rounded-xl p-5 text-center">
                <div className="text-2xl mb-2">❤️</div>
                <h4 className="text-slate-900 font-semibold mb-1">Focus</h4>
                <p className="text-slate-700 text-sm">Performance, clarity, and usability</p>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <a
                href="mailto:abhikamailhai@gmail.com"
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaHeart /> Connect
              </a>
              <button
                onClick={() => navigate('/our-story')}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition flex items-center gap-2"
              >
                <FaCode /> Our Story
              </button>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/abhishekdas_musicc/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg border border-teal-500/30 text-slate-700 hover:text-slate-900 hover:border-teal-400/70 hover:bg-teal-500/10 transition flex items-center gap-2"
                aria-label="Instagram profile"
              >
                <FaInstagram className="text-teal-600" /> Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-das-cse/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg border border-teal-500/30 text-slate-700 hover:text-slate-900 hover:border-teal-400/70 hover:bg-teal-500/10 transition flex items-center gap-2"
                aria-label="LinkedIn profile"
              >
                <FaLinkedin className="text-teal-600" /> LinkedIn
              </a>
              <a
                href="https://github.com/abhishekdas2104"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg border border-teal-500/30 text-slate-700 hover:text-slate-900 hover:border-teal-400/70 hover:bg-teal-500/10 transition flex items-center gap-2"
                aria-label="GitHub profile"
              >
                <FaGithub className="text-teal-600" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeveloperPage;
