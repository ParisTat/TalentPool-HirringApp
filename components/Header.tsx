
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const NavLinkItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors ${
        isActive ? 'text-primary' : 'text-slate-600 hover:text-primary-dark'
      }`
    }
  >
    {children}
  </NavLink>
);

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary-dark">
              TalentPool
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <NavLinkItem to="/jobs">Browse Jobs</NavLinkItem>
            <NavLinkItem to="/candidate-dashboard">Candidate</NavLinkItem>
            <NavLinkItem to="/recruiter-dashboard">Recruiter</NavLinkItem>
            <NavLinkItem to="/about">About</NavLinkItem>
            <NavLinkItem to="/contact">Contact</NavLinkItem>
          </nav>
          <div className="hidden md:block">
            <Link
              to="#"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
