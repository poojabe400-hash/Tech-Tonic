import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Users,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

export const EventsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState(new Set());
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [formatType, setFormatType] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // Modal & Toast
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchEvents();
    if (isAuthenticated) {
      fetchSavedEvents();
    }
  }, [page, category, formatType, sortBy]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        search,
        category,
        format: formatType,
        sort_by: sortBy,
      });

      const res = await api.get(`/events?${params.toString()}`);
      if (res.success && res.data) {
        setEvents(res.data.items || []);
        setTotal(res.data.total || 0);
      }
    } catch (e) {
      console.warn('Events fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedEvents = async () => {
    try {
      const res = await api.get('/events/saved');
      if (res.success && res.data) {
        const ids = new Set(res.data.map(item => item.event_id || item._id));
        setSavedEventIds(ids);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleSaveToggle = async (ev) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const evId = ev._id || ev.id;
    if (savedEventIds.has(evId)) {
      // Unsave
      try {
        await api.delete(`/events/saved/${evId}`);
        setSavedEventIds(prev => {
          const next = new Set(prev);
          next.delete(evId);
          return next;
        });
        showToast(`Removed '${ev.title}' from My Events.`);
      } catch (e) {
        // ignore
      }
    } else {
      // Save
      try {
        await api.post('/events/save', { event_id: evId });
        setSavedEventIds(prev => new Set(prev).add(evId));
        showToast(`Saved '${ev.title}' to My Events!`);
      } catch (e) {
        // ignore
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Hackathons & Tech Events</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
            {total} Verified Events
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore upcoming national hackathons, coding contests, webinars, and campus recruitment drives.
        </p>
      </div>

      {/* Search and Filters */}
      <section className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, organizer, category (e.g. Smart India, Hackathon, CTF)..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filters:</span>
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="Hackathon">Hackathons</option>
            <option value="Coding Competition">Coding Competitions</option>
            <option value="Workshop">Workshops</option>
            <option value="Webinar">Webinars</option>
            <option value="Placement Drive">Placement Drives</option>
            <option value="College Fest">College Fests</option>
            <option value="Certification Program">Certification Cohorts</option>
          </select>

          {/* Format */}
          <select
            value={formatType}
            onChange={(e) => { setFormatType(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700"
          >
            <option value="all">All Formats</option>
            <option value="online">Online / Virtual</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700"
          >
            <option value="deadline">Registration Deadline (Urgent First)</option>
            <option value="start_date">Event Start Date</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </section>

      {/* Events Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading verified hackathons and events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No events matched your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your category or search term to browse all national events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => {
            const evId = ev._id || ev.id;
            const isSaved = savedEventIds.has(evId);

            return (
              <div
                key={evId}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {ev.category}
                    </span>
                    <button
                      onClick={() => handleSaveToggle(ev)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Remove from My Events' : 'Save to My Events'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {ev.organizer}
                  </p>

                  <div className="mt-2.5 flex items-center space-x-3 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.format}</span> ({ev.location})
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Event Dates:</span>
                      <span className="font-semibold text-slate-800">{ev.start_date} to {ev.end_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Entry Fee:</span>
                      <span className="font-semibold text-emerald-600">{ev.fee || 'Free'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Status</span>
                      <span className="font-bold text-indigo-700">{ev.status || 'Open'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Deadline</span>
                      <span className="font-bold text-rose-600">{ev.registration_deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <a
                      href={ev.registration_url || 'https://example.com/register'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>Register</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  {selectedEvent.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedEvent.title}</h2>
                <p className="text-xs text-slate-600 font-medium">{selectedEvent.organizer} • {selectedEvent.location}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Event Overview</h4>
                <p className="leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Eligibility Criteria</h4>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedEvent.eligibility || 'Open to all college students.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium">Dates</span>
                  <span className="font-bold text-slate-800">{selectedEvent.start_date} to {selectedEvent.end_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Entry Fee</span>
                  <span className="font-bold text-emerald-600">{selectedEvent.fee || 'Free'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleSaveToggle(selectedEvent)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                {savedEventIds.has(selectedEvent._id || selectedEvent.id) ? 'Saved in My Events ✓' : '+ Save to My Events'}
              </button>

              <a
                href={selectedEvent.registration_url || 'https://example.com/register'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
              >
                <span>Register on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
