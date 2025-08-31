import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

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
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
            {user && profile?.role === 'candidate' && (
              <NavLinkItem to="/candidate-dashboard">My Dashboard</NavLinkItem>
            )}
            {user && profile?.role === 'recruiter' && (
              <NavLinkItem to="/recruiter-dashboard">Recruiter Dashboard</NavLinkItem>
            )}
            <NavLinkItem to="/about">About</NavLinkItem>
            <NavLinkItem to="/contact">Contact</NavLinkItem>
          </nav>
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">Welcome, {profile?.name}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;