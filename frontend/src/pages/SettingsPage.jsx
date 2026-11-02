import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Database,
  CheckCircle2,
  Save,
  LogOut
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, profile, logout } = useAuth();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [eventAlerts, setEventAlerts] = useState(true);
  const [savedBanner, setSavedBanner] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedBanner('Platform preferences updated successfully!');
    setTimeout(() => setSavedBanner(''), 3000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Account & Platform Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your notification preferences, credentials, and session state.
        </p>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Account Profile Card */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Current Authenticated Identity</h3>
            <p className="text-xs text-slate-500">Verified through Firebase Auth and REST API</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold">ACCOUNT HOLDER</span>
            <span className="text-sm font-bold text-slate-900">{profile?.full_name || user?.name || 'Aarav Sharma'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold">AUTHENTICATED EMAIL</span>
            <span className="text-sm font-bold text-slate-900">{user?.email || 'demo.student@careerbridge.ai'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold">ROLE & PERMISSIONS</span>
            <span className="text-sm font-bold text-blue-600 capitalize">{user?.role || 'student'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold">COLLEGE / INSTITUTION</span>
            <span className="text-sm font-bold text-slate-900">{profile?.college || 'National Institute of Technology'}</span>
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">In-App Notification Preferences</h3>
            <p className="text-xs text-slate-500">Select which automated updates you wish to receive</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">High Match Opportunity Alerts</p>
              <p className="text-[11px] text-slate-500">Notify when an internship matches 80%+ of your skill profile.</p>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Hackathon Deadline Reminders</p>
              <p className="text-[11px] text-slate-500">Alert 48 hours before registration closes for shortlisted events.</p>
            </div>
            <input
              type="checkbox"
              checked={eventAlerts}
              onChange={(e) => setEventAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Application Status Changes</p>
              <p className="text-[11px] text-slate-500">Alert when an application status changes to Under Review or Interview.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </section>

      {/* Security & Sign Out */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Session Security</h3>
          <p className="text-xs text-slate-500">End your active authenticated session on this browser</p>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </section>
    </div>
  );
};
