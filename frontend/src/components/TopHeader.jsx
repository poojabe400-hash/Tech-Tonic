import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Menu,
  Bell,
  Search,
  User,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const TopHeader = ({ onMenuClick }) => {
  const { user, profile, isAdmin, loginAsDemoStudent, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data.items || []);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs text-slate-500 font-medium">
            Welcome back, <span className="font-semibold text-slate-800">{profile?.full_name || user?.name || 'Student'}</span>
          </p>
          <p className="text-[11px] text-blue-600 font-medium">
            "Your Skills. Your Future. Our AI."
          </p>
        </div>
      </div>

      {/* Right: Quick Actions, Demo Switcher, Notifications, Profile */}
      <div className="flex items-center space-x-3">
        {/* Fast Evaluation Switcher for Hackathon Reviewers */}
        <div className="hidden md:flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={async () => {
              await loginAsDemoStudent();
              navigate('/dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              !isAdmin ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Demo Student
          </button>
          <button
            onClick={async () => {
              await loginAsDemoAdmin();
              navigate('/admin');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              isAdmin ? 'bg-amber-500 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Demo Admin
          </button>
        </div>

        {/* AI Assistant Quick Launcher */}
        <NavLink
          to="/dashboard/assistant"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:bg-blue-100/80 text-xs font-semibold transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Assistant</span>
        </NavLink>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  <p className="text-[11px] text-slate-500">{unreadCount} unread alerts</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No notifications right now
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n._id}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start space-x-3 ${
                        !n.is_read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">
                          {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <NavLink
                  to="/dashboard/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All Notifications →
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Link */}
        <NavLink
          to="/dashboard/profile"
          className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {(profile?.full_name || user?.name || 'S').charAt(0).toUpperCase()}
          </div>
        </NavLink>
      </div>
    </header>
  );
};
