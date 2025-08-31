
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobs } from '../data/mockData';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600">Job not found</h2>
        <Link to="/jobs" className="text-primary hover:underline mt-4 inline-block">
          &larr; Back to all jobs
        </Link>
      </div>
    );
  }

  const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="mt-8">
        <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
        {children}
    </div>
  );


  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
            <div>
                <h1 className="text-4xl font-extrabold text-secondary">{job.title}</h1>
                <p className="text-lg text-slate-600 mt-2">{job.company} &bull; {job.location}</p>
            </div>
            <div className="mt-4 md:mt-0">
                <button className="px-8 py-3 text-lg font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors w-full md:w-auto">
                    Apply Now
                </button>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <div>
                <p className="text-sm text-slate-500">Salary</p>
                <p className="font-semibold text-secondary">{job.salary}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500">Job Type</p>
                <p className="font-semibold text-secondary">{job.type}</p>
            </div>
        </div>
      
      <Section title="Job Description">
        <p className="text-slate-600 leading-relaxed">{job.description}</p>
      </Section>

      <Section title="Responsibilities">
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </Section>

      <Section title="Qualifications">
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {job.qualifications.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </Section>

      <div className="mt-10 text-center">
          <Link to="/jobs" className="text-primary hover:text-primary-dark font-medium transition-colors">
            &larr; Back to job listings
          </Link>
      </div>
    </div>
  );
};

export default JobDetailsPage;
