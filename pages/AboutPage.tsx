
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-sm">
      <h1 className="text-4xl font-extrabold text-secondary dark:text-slate-100 mb-6">About TalentPool</h1>
      <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          TalentPool was founded with a simple mission: to bridge the gap between talented professionals and the world's most innovative companies. We believe that finding the right job shouldn't be a chore, but an exciting journey towards professional growth and fulfillment.
        </p>
        <p>
          Our platform is designed to be intuitive, efficient, and user-friendly for both job seekers and recruiters. We leverage modern technology to streamline the hiring process, making it easier than ever to discover opportunities, connect with top talent, and build successful teams.
        </p>
        <p>
          For candidates, we offer a curated list of high-quality job openings from leading companies across various industries. Our powerful search and filtering tools help you narrow down your search to find the perfect role that matches your skills, experience, and career aspirations.
        </p>
        <p>
          For recruiters, TalentPool provides a robust set of tools to manage job postings, attract qualified candidates, and simplify the recruitment lifecycle. We are committed to helping you find the right people who will drive your company's success.
        </p>
        <p>
          Thank you for being part of our community. Together, let's build the future of work.
        </p>
      </div>
      
      {/* Developer Watermark - Only visible in production builds */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="text-sm text-slate-500 dark:text-slate-500 text-center">
          <p>© 2025 Paristat — TalentPool</p>
          <p className="mt-1">Professional Hiring Platform</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
