import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ThemeToggle from './ThemeToggle';

const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  const NavLinkItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ 
    to, 
    children, 
    onClick 
  }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2 text-base font-medium transition-colors ${
          isActive 
            ? 'text-primary bg-primary/10' 
            : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5'
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <div className="md:hidden">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-800 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className="text-xl font-bold text-primary-dark dark:text-primary-light"
                >
                  TalentPool
                </Link>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLinkItem to="/jobs" onClick={closeMenu}>
                  Browse Jobs
                </NavLinkItem>
                
                {user && profile?.role === 'candidate' && (
                  <NavLinkItem to="/candidate-dashboard" onClick={closeMenu}>
                    My Dashboard
                  </NavLinkItem>
                )}
                
                {user && profile?.role === 'recruiter' && (
                  <NavLinkItem to="/recruiter-dashboard" onClick={closeMenu}>
                    Recruiter Dashboard
                  </NavLinkItem>
                )}
                
                <NavLinkItem to="/about" onClick={closeMenu}>
                  About
                </NavLinkItem>
                
                <NavLinkItem to="/contact" onClick={closeMenu}>
                  Contact
                </NavLinkItem>
              </nav>

              {/* User Section */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                {user ? (
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Welcome, <span className="font-medium">{profile?.name}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="block w-full px-4 py-2 text-sm font-medium text-center text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
