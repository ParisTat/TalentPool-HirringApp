
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} TalentPool. All rights reserved.</p>
        <p className="text-sm mt-2">A modern hiring platform built with passion.</p>
      </div>
    </footer>
  );
};

export default Footer;
