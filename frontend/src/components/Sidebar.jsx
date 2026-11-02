import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Calendar,
  Sparkles,
  BarChart3,
  Compass,
  Scale,
  Award,
  Bot,
  CheckSquare,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/profile', label: 'My Profile', icon: User },
  { path: '/dashboard/resume', label: 'Resume Analyzer', icon: FileText },
  { path: '/dashboard/jobs', label: 'Jobs & Internships', icon: Briefcase },
  { path: '/dashboard/events', label: 'Hackathons & Events', icon: Calendar },
  { path: '/dashboard/matching', label: 'AI Opportunity Matching', icon: Sparkles, badge: 'AI' },
  { path: '/dashboard/skill-gap', label: 'Skill Gap Analyzer', icon: BarChart3 },
  { path: '/dashboard/career-gps', label: 'Career GPS', icon: Compass },
  { path: '/dashboard/equalizer', label: 'Opportunity Equalizer', icon: Scale, badge: 'Equalizer' },
  { path: '/dashboard/readiness', label: 'Career Readiness Simulator', icon: Award, badge: 'Score' },
  { path: '/dashboard/scholarships', label: 'Scholarships & Programs', icon: Award },
  { path: '/dashboard/assistant', label: 'AI Career Assistant', icon: Bot, badge: 'Live' },
  { path: '/dashboard/applications', label: 'My Applications', icon: CheckSquare },
  { path: '/dashboard/saved', label: 'Saved Opportunities', icon: Bookmark },
  { path: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B132B] text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center">
                CareerBridge<span className="text-cyan-400 ml-0.5">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Campus-to-Employment
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-950 text-cyan-300 border border-cyan-800/40'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Admin link if administrator */}
          {isAdmin && (
            <div className="pt-3">
              <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
                Administration
              </div>
              <NavLink
                to="/admin"
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-amber-300 hover:bg-slate-800/70 hover:text-amber-200'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Admin Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </NavLink>
            </div>
          )}
        </div>

        {/* User Mini Profile & Logout */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 mb-2">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                {(profile?.full_name || user?.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {profile?.full_name || user?.name || 'Student Account'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'student@careerbridge.ai'}
                </p>
              </div>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 shrink-0 font-medium">
              Ready
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-900/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
