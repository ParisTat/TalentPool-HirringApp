
import { Job, Candidate, Recruiter } from '../types';

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'Innovate Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150,000 - $180,000',
    description: 'We are seeking an experienced Senior Frontend Engineer to build and maintain our next-generation user interfaces using React and TypeScript.',
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and front-end libraries for future use',
      'Translate designs and wireframes into high-quality code',
      'Optimize components for maximum performance across a vast array of web-capable devices and browsers'
    ],
    qualifications: [
      'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model',
      'Thorough understanding of React.js and its core principles',
      'Experience with popular React.js workflows (such as Flux or Redux)',
      'Familiarity with newer specifications of EcmaScript',
      'Experience with data structure libraries (e.g., Immutable.js)'
    ]
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$110,000 - $130,000',
    description: 'Creative Solutions is looking for a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.',
    responsibilities: [
        'Collaborate with product management and engineering to define and implement innovative solutions for the product direction, visuals and experience',
        'Execute all visual design stages from concept to final hand-off to engineering',
        'Create wireframes, storyboards, user flows, process flows and site maps to effectively communicate interaction and design ideas'
    ],
    qualifications: [
        'Proven UI experience',
        'Demonstrable UI design skills with a strong portfolio',
        'Solid experience in creating wireframes, storyboards, user flows, process flows and site maps',
        'Proficiency in Figma, Sketch, Photoshop, Illustrator, or other visual design and wire-framing tools'
    ]
  },
    {
    id: '3',
    title: 'Backend Developer (Node.js)',
    company: 'DataStream',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    description: 'We are looking for a Backend Developer to join our team. You will be responsible for managing the interchange of data between the server and the users.',
    responsibilities: [
        'Integration of user-facing elements developed by a front-end developer with server-side logic',
        'Building reusable code and libraries for future use',
        'Optimization of the application for maximum speed and scalability',
        'Implementation of security and data protection'
    ],
    qualifications: [
        'Strong proficiency with JavaScript and Node.js',
        'Knowledge of Node.js and frameworks available for it (e.g., Express, Koa)',
        'Understanding the nature of asynchronous programming',
        'Experience with database technologies such as PostgreSQL or MongoDB'
    ]
  },
  {
    id: '4',
    title: 'Digital Marketing Specialist',
    company: 'Growth Gurus',
    location: 'Austin, TX',
    type: 'Part-time',
    salary: '$60,000 - $75,000',
    description: 'Join our marketing team to develop, implement, track and optimize our digital marketing campaigns across all digital channels.',
     responsibilities: [
        'Plan and execute all digital marketing, including SEO/SEM, marketing database, email, social media and display advertising campaigns',
        'Measure and report performance of all digital marketing campaigns',
        'Identify trends and insights, and optimize spend and performance based on the insights'
    ],
    qualifications: [
        'Proven working experience in digital marketing',
        'Demonstrable experience leading and managing SEO/SEM, marketing database, email, social media and/or display advertising campaigns',
        'Highly creative with experience in identifying target audiences and devising digital campaigns that engage, inform and motivate'
    ]
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'Innovate Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$140,000 - $170,000',
    description: 'As a Product Manager, you will be responsible for the product planning and execution throughout the Product Lifecycle.',
    responsibilities: [
        'Define the product vision, roadmap and growth opportunities',
        'Work closely with engineering, sales, marketing, and support to ensure business case and customer satisfaction goals are met',
        'Gather and prioritize product and customer requirements'
    ],
    qualifications: [
        'Proven work experience in product management',
        'Proven track record of managing all aspects of a successful product throughout its lifecycle',
        'Solid technical background with understanding and/or hands-on experience in software development and web technologies'
    ]
  },
];

export const candidate: Candidate = {
  id: 'c1',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  headline: 'Senior Frontend Developer | React, TypeScript, Next.js',
  appliedJobs: ['1', '5']
};

export const recruiter: Recruiter = {
    id: 'r1',
    name: 'John Smith',
    company: 'Innovate Inc.',
    postedJobs: ['1', '5']
};
