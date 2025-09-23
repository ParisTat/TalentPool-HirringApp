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

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const NavLinkItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ 
    to, 
    children, 
    onClick 
  }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : 'mobile-nav-item--inactive'}`
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

      {/* Full Screen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden h-screen">
          {/* Full Screen Menu with proper background */}
          <div className="fixed inset-0 h-screen mobile-menu-bg">
            <div className="flex flex-col h-screen">
              {/* Header with Logo and Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80">
                {/* TalentPool Logo */}
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className="text-2xl font-bold text-primary-dark dark:text-primary-light"
                >
                  TalentPool
                </Link>
                
                {/* Theme Toggle and Close Button */}
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6"
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

              {/* Navigation Links - Stretched to fill space */}
              <nav className="flex-1 flex flex-col justify-center items-center space-y-8 py-12">
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

              {/* User Section - Pushed to bottom */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80">
                {user ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Welcome back!
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {profile?.name}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-6 py-3 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="block w-full px-6 py-3 text-base font-medium text-center text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="block w-full px-6 py-3 text-base font-medium text-center text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
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