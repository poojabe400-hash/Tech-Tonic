import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../services/api';
import {
  Bookmark,
  Briefcase,
  Calendar,
  Trash2,
  ExternalLink,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const SavedOpportunitiesPage = () => {
  const [savedOpps, setSavedOpps] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'events'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    setIsLoading(true);
    try {
      const [oppsRes, eventsRes] = await Promise.allSettled([
        api.get('/opportunities/saved'),
        api.get('/events/saved'),
      ]);

      if (oppsRes.status === 'fulfilled' && oppsRes.value.success) {
        setSavedOpps(oppsRes.value.data || []);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
        setSavedEvents(eventsRes.value.data || []);
      }
    } catch (e) {
      console.warn('Saved error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveOpp = async (oppId) => {
    try {
      await api.delete(`/opportunities/saved/${oppId}`);
      setSavedOpps(prev => prev.filter(o => (o.opportunity_id || o._id) !== oppId));
    } catch (e) {
      // ignore
    }
  };

  const handleRemoveEvent = async (eventId) => {
    try {
      await api.delete(`/events/saved/${eventId}`);
      setSavedEvents(prev => prev.filter(e => (e.event_id || e._id) !== eventId));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Saved Opportunities & Events</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {savedOpps.length + savedEvents.length} Shortlisted
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your bookmarked positions, hackathons, and conferences ready for application.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'jobs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Saved Jobs & Internships ({savedOpps.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'events'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Events & Hackathons ({savedEvents.length})
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading your shortlisted items...</p>
        </div>
      ) : activeTab === 'jobs' ? (
        savedOpps.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No saved opportunities yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse the Jobs & Internships module and click the bookmark button to build your shortlist.
            </p>
            <NavLink
              to="/dashboard/jobs"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              <span>Explore Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOpps.map((opp) => {
              const targetId = opp.opportunity_id || opp._id;
              return (
                <div
                  key={opp._id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {opp.type || 'Internship'}
                      </span>
                      <button
                        onClick={() => handleRemoveOpp(targetId)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">{opp.company}</p>
                    <p className="text-[11px] text-slate-400 mt-1 capitalize">{opp.mode} • {opp.location}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Due: {opp.deadline || 'Upcoming'}</span>
                    <NavLink
                      to={`/dashboard/jobs`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1 shadow-xs"
                    >
                      <span>View & Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        savedEvents.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No events saved yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Shortlist hackathons and webinars in the Hackathons & Events section to keep track of deadlines.
            </p>
            <NavLink
              to="/dashboard/events"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEvents.map((ev) => {
              const targetId = ev.event_id || ev._id;
              return (
                <div
                  key={ev._id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {ev.category}
                      </span>
                      <button
                        onClick={() => handleRemoveEvent(targetId)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Remove from saved events"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">{ev.organizer}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{ev.format} • {ev.start_date}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600">Deadline: {ev.registration_deadline}</span>
                    <a
                      href={ev.registration_url || 'https://example.com/register'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1 shadow-xs"
                    >
                      <span>Register</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
