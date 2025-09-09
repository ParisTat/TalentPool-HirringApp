
import React, { useState, useMemo, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { Job } from '../types';
import { useJobs } from '../hooks/useJobs';

const JobsListPage: React.FC = () => {
  const { jobs, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
      const matchesType = typeFilter ? job.type === typeFilter : true;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, locationFilter, typeFilter]);

  const locations = useMemo(() => [...new Set(jobs.map(job => job.location))], [jobs]);
  const types = useMemo(() => [...new Set(jobs.map(job => job.type))], [jobs]);


  return (
    <div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-secondary dark:text-slate-100 mb-2">Find Your Perfect Job</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {isLoading ? 'Loading jobs...' : `Search from ${jobs.length} open positions.`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Job title or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary lg:col-span-2"
          />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
          >
            <option value="">All Types</option>
            {types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-slate-600 dark:text-slate-400">Loading jobs...</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.length > 0 ? (
              filteredJobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
              <p className="text-slate-500 dark:text-slate-400 md:col-span-2 lg:col-span-3 text-center">No jobs found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsListPage;
