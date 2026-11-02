import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              CareerBridge<span className="text-blue-600 ml-0.5">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Your Skills • Your Future • Our AI
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <NavLink to="/" className={({ isActive }) => `hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600' : ''}`}>
            Explore Opportunities
          </NavLink>
          <NavLink to="/events-explore" className={({ isActive }) => `hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600' : ''}`}>
            Events & Hackathons
          </NavLink>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            How It Works
          </a>
          <a href="#about-us" className="hover:text-blue-600 transition-colors">
            About Us
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <NavLink
              to={isAdmin ? '/admin' : '/dashboard'}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/25 transition-all hover:-translate-y-0.5"
            >
              <span>{isAdmin ? 'Admin Console' : 'Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all"
              >
                Log In
              </NavLink>
              <NavLink
                to="/register"
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-3">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Explore Opportunities
          </NavLink>
          <NavLink
            to="/events-explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Events & Hackathons
          </NavLink>
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <NavLink
                to={isAdmin ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
              >
                Open Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
                >
                  Get Started Free
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
