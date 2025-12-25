import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <p className="font-semibold text-slate-900 text-lg">MediVibe</p>
            <p className="mt-2 text-sm text-slate-600">Clear, calm tools for hospital bed management.</p>
          </div>

          {/* About */}
          <div>
            <p className="font-semibold text-slate-900 mb-4">About</p>
            <div className="space-y-2 text-sm">
              <button onClick={() => navigate('/about')} className="block text-slate-600 hover:text-teal-700 transition-colors">About</button>
              <button onClick={() => navigate('/our-story')} className="block text-slate-600 hover:text-teal-700 transition-colors">Our Story</button>
              <button onClick={() => navigate('/careers')} className="block text-slate-600 hover:text-teal-700 transition-colors">Careers</button>
            </div>
          </div>

          {/* Help Centre */}
          <div>
            <p className="font-semibold text-slate-900 mb-4">Support</p>
            <div className="space-y-2 text-sm">
              <button onClick={() => navigate('/help-centre')} className="block text-slate-600 hover:text-teal-700 transition-colors">Help Centre</button>
              <button onClick={() => navigate('/privacy-settings')} className="block text-slate-600 hover:text-teal-700 transition-colors">Privacy Settings</button>
              <button onClick={() => navigate('/contact-info')} className="block text-slate-600 hover:text-teal-700 transition-colors">Contact Us</button>
            </div>
          </div>

          {/* Connect */}
          <div>
            <p className="font-semibold text-slate-900 mb-4">Connect</p>
            <div className="space-y-2 text-sm">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors">
                <FaInstagram className="w-4 h-4" />
                Instagram
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors">
                <FaLinkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors">
                <FaGithub className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Developer */}
          <div>
            <p className="font-semibold text-slate-900 mb-4">Developer</p>
            <button onClick={() => navigate('/developer')} className="block text-sm text-slate-600 hover:text-teal-700 transition-colors">Developer of MediVibe</button>
            <p className="text-xs text-slate-500 mt-4">© 2025 MediVibe. All rights reserved.</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>Built with care for modern hospitals.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
