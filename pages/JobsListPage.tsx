
import React, { useState, useMemo } from 'react';
import { jobs } from '../data/mockData';
import JobCard from '../components/JobCard';
import { Job } from '../types';

const JobsListPage: React.FC = () => {
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
  }, [searchTerm, locationFilter, typeFilter]);

  const locations = useMemo(() => [...new Set(jobs.map(job => job.location))], []);
  const types = useMemo(() => [...new Set(jobs.map(job => job.type))], []);


  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">Find Your Perfect Job</h1>
        <p className="text-slate-600 mb-6">Search from {jobs.length} open positions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Job title or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary lg:col-span-2"
          />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">All Types</option>
            {types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.length > 0 ? (
            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
        ) : (
            <p className="text-slate-500 md:col-span-2 lg:col-span-3 text-center">No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default JobsListPage;
