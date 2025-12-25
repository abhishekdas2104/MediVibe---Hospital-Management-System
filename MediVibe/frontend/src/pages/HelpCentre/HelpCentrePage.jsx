import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital, FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Footer from '../../components/Layout/Footer';

const HelpCentrePage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I register for MediVibe?',
          a: 'Click on the "Register" button on the homepage. Fill in your details including name, email, password, and select your account type (Staff, Doctor, Nurse, Receptionist, or Admin). After registration, you can log in with your credentials.',
        },
        {
          q: 'What are the different user roles?',
          a: 'MediVibe supports 5 user roles: Admin (full system control), Doctor (patient care and duty management), Nurse (patient care notes and bed cleaning), Receptionist (patient admission/discharge), and Staff (general overview and tasks).',
        },
        {
          q: 'How do I reset my password?',
          a: 'Currently, password reset is handled by contacting the admin at abhikamailhai@gmail.com. A self-service password reset feature is coming soon.',
        },
      ],
    },
    {
      category: 'Bed Management',
      questions: [
        {
          q: 'How do I check bed availability?',
          a: 'Real-time bed availability is displayed on the public dashboard homepage. Staff members can view detailed bed status by ward in their respective dashboards.',
        },
        {
          q: 'What are the different bed statuses?',
          a: 'Beds can have 4 statuses: Available (ready for new patient), Occupied (currently in use), Cleaning (being sanitized), and Maintenance (under repair or inspection).',
        },
        {
          q: 'How are beds assigned to patients?',
          a: 'When a receptionist admits a patient, the system automatically finds and assigns an available bed in the selected ward. The bed status is updated to "Occupied" immediately.',
        },
      ],
    },
    {
      category: 'Patient Management',
      questions: [
        {
          q: 'How do I admit a new patient?',
          a: 'Receptionists can admit patients through their dashboard by filling the admission form with patient details, selecting a ward, and providing admission reason. The system will automatically assign an available bed.',
        },
        {
          q: 'How do doctors and nurses track patient care?',
          a: 'Doctors can view their assigned patients and update care notes. Nurses can add detailed care notes including vitals (temperature, blood pressure, heart rate, oxygen levels) and view full care history.',
        },
        {
          q: 'How do I discharge a patient?',
          a: 'Receptionists can discharge patients from their dashboard. This updates the patient status, frees the bed (sets it to "Cleaning"), and marks all assignments as completed.',
        },
      ],
    },
    {
      category: 'Dashboard Features',
      questions: [
        {
          q: 'What can I see on my dashboard?',
          a: 'Each role sees different information: Admins see user/bed management and reports, Doctors see duties and assigned patients, Nurses see shifts and care tasks, Receptionists see admission/discharge workflows, and Staff see general overview.',
        },
        {
          q: 'Are updates real-time?',
          a: 'Yes! MediVibe is designed with real-time updates. Bed status changes, patient admissions, and care notes are reflected immediately across all dashboards.',
        },
        {
          q: 'Can I export reports?',
          a: 'Admins can generate occupancy reports by ward showing bed utilization statistics. More report types are being added in future updates.',
        },
      ],
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'What browsers are supported?',
          a: 'MediVibe works best on modern browsers: Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. Make sure JavaScript is enabled.',
        },
        {
          q: 'Is my data secure?',
          a: 'Yes! All data is encrypted, passwords are hashed using bcrypt, and authentication uses JWT tokens. We follow industry-standard security practices.',
        },
        {
          q: 'Who do I contact for technical issues?',
          a: 'For technical support, email abhikamailhai@gmail.com with a description of the issue, your role, and screenshots if applicable. We typically respond within 24 hours.',
        },
      ],
    },
  ];

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFaq(openFaq === key ? null : key);
  };

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
              <FaQuestionCircle className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Help Centre</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-teal-700 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-700 text-lg">
              Find answers to common questions about using MediVibe
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => navigate('/contact-info')}
              className="bg-gradient-to-br from-teal-500/20 to-teal-400/20 border border-teal-500/30 hover:border-teal-400/60 rounded-xl p-6 transition text-left"
            >
              <h3 className="text-white font-semibold mb-2">📧 Contact Support</h3>
              <p className="text-stone-300 text-sm">Get direct help from our team</p>
            </button>
            <button
              onClick={() => navigate('/our-story')}
              className="bg-gradient-to-br from-teal-500/20 to-teal-500/20 border border-teal-500/30 hover:border-teal-400/60 rounded-xl p-6 transition text-left"
            >
              <h3 className="text-white font-semibold mb-2">📖 About MediVibe</h3>
              <p className="text-stone-300 text-sm">Learn about our platform</p>
            </button>
            <button
              onClick={() => navigate('/privacy-settings')}
              className="bg-gradient-to-br from-teal-500/20 to-teal-500/20 border border-teal-500/30 hover:border-teal-400/60 rounded-xl p-6 transition text-left"
            >
              <h3 className="text-white font-semibold mb-2">🔒 Privacy Policy</h3>
              <p className="text-stone-300 text-sm">View our privacy practices</p>
            </button>
          </div>

          {/* FAQs */}
          <div className="space-y-8">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-2xl font-bold text-teal-600 mb-4">{category.category}</h2>
                <div className="space-y-3">
                  {category.questions.map((faq, qIndex) => {
                    const key = `${catIndex}-${qIndex}`;
                    const isOpen = openFaq === key;
                    return (
                      <div
                        key={qIndex}
                        className="backdrop-blur-xl bg-slate-100 bg-opacity-90 border border-teal-500 border-opacity-20 hover:border-opacity-40 rounded-xl overflow-hidden transition"
                      >
                        <button
                          onClick={() => toggleFaq(catIndex, qIndex)}
                          className="w-full flex items-center justify-between p-5 text-left"
                        >
                          <span className="text-slate-900 font-semibold pr-4">{faq.q}</span>
                          {isOpen ? (
                            <FaChevronUp className="text-teal-600 flex-shrink-0" />
                          ) : (
                            <FaChevronDown className="text-teal-600 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-0">
                            <div className="border-t border-slate-300 pt-4">
                              <p className="text-slate-700 leading-relaxed">{faq.a}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="mt-12 bg-gradient-to-r from-teal-500/10 to-teal-400/10 border border-teal-500/20 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Still Need Help?</h3>
            <p className="text-slate-700 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:abhikamailhai@gmail.com?subject=MediVibe Support Request"
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                Email Support
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

export default HelpCentrePage;
