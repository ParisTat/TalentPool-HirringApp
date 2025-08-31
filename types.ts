
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  headline: string;
  appliedJobs: string[];
}

export interface Recruiter {
    id: string;
    name: string;
    company: string;
    postedJobs: string[];
}
