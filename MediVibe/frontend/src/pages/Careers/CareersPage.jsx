import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital, FaBriefcase, FaCode, FaUsers, FaChartLine, FaRocket } from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';

const CareersPage = () => {
  const navigate = useNavigate();

  const opportunities = [
    {
      title: 'Full Stack Developer',
      icon: FaCode,
      description: 'Join us to build scalable healthcare solutions using React, Node.js, and MongoDB.',
      type: 'Full-time',
    },
    {
      title: 'UI/UX Designer',
      icon: FaUsers,
      description: 'Design intuitive, user-friendly interfaces for healthcare professionals.',
      type: 'Contract',
    },
    {
      title: 'Product Manager',
      icon: FaChartLine,
      description: 'Lead product development and strategy for hospital management features.',
      type: 'Full-time',
    },
    {
      title: 'DevOps Engineer',
      icon: FaRocket,
      description: 'Optimize deployment pipelines and ensure platform reliability at scale.',
      type: 'Full-time',
    },
  ];

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
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="backdrop-blur-xl bg-white bg-opacity-90 border border-teal-500 border-opacity-30 rounded-2xl shadow-2xl p-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-full mb-4">
              <FaBriefcase className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Join Our Team</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-teal-700 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-700 text-lg leading-relaxed max-w-3xl mx-auto">
              We're building the future of hospital management technology. If you're passionate about healthcare innovation, clean code, and meaningful impact, we'd love to hear from you.
            </p>
          </div>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {opportunities.map((job, index) => {
              const Icon = job.icon;
              return (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 rounded-xl p-6 hover:border-opacity-60 transition transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg flex-shrink-0">
                      <Icon className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                        <span className="text-xs bg-teal-500/20 text-teal-700 px-3 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{job.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Why Join Section */}
          <div className="bg-gradient-to-r from-teal-500/10 to-teal-400/10 border border-teal-500/20 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Why Join MediVibe?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">💡</div>
                <h4 className="text-teal-700 font-semibold mb-2">Innovation</h4>
                <p className="text-slate-700 text-sm">Work on cutting-edge healthcare technology</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🚀</div>
                <h4 className="text-teal-700 font-semibold mb-2">Growth</h4>
                <p className="text-slate-700 text-sm">Continuous learning and skill development</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🎯</div>
                <h4 className="text-teal-700 font-semibold mb-2">Impact</h4>
                <p className="text-slate-700 text-sm">Build solutions that improve patient care</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-slate-700 text-lg mb-6">
              Interested in joining our mission? Send your resume and portfolio to get started.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:abhikamailhai@gmail.com?subject=Career Opportunity at MediVibe"
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                Apply Now
              </a>
              <button
                onClick={() => navigate('/contact-info')}
                className="px-8 py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition"
              >
                Contact Us
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

export default CareersPage;
