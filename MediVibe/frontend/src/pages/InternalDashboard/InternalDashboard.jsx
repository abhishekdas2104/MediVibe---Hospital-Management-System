import React from 'react';
import { FaHome } from 'react-icons/fa';

const InternalDashboard = () => {
  return (
    <div className="min-h-screen bg-stone-900">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FaHome className="text-6xl text-teal-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Internal Dashboard</h1>
          <p className="text-stone-400">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default InternalDashboard;
