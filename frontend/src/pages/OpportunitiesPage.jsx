import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const OpportunitiesPage = () => {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [oppType, setOppType] = useState('all');
  const [mode, setMode] = useState('all');
  const [experience, setExperience] = useState('all');
  const [beginnerOnly, setBeginnerOnly] = useState(false);

  // Detail Modal
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchOpportunities();
    if (isAuthenticated) {
      fetchSavedIds();
    }
  }, [page, oppType, mode, experience, beginnerOnly]);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        search,
        type: oppType,
        mode,
        experience_level: experience,
        beginner_friendly: beginnerOnly ? 'true' : 'false',
      });

      const res = await api.get(`/opportunities?${params.toString()}`);
      if (res.success && res.data) {
        setOpportunities(res.data.items || []);
        setTotal(res.data.total || 0);
      }
    } catch (e) {
      console.warn('Fetch opportunities error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedIds = async () => {
    try {
      const res = await api.get('/opportunities/saved');
      if (res.success && res.data) {
        const ids = new Set(res.data.map(item => item.opportunity_id || item._id));
        setSavedIds(ids);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOpportunities();
  };

  const handleSaveToggle = async (opp) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const oppId = opp._id || opp.id;
    if (savedIds.has(oppId)) {
      // Unsave
      try {
        await api.delete(`/opportunities/saved/${oppId}`);
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(oppId);
          return next;
        });
        showToast(`Removed '${opp.title}' from saved shortlist.`);
      } catch (e) {
        // ignore
      }
    } else {
      // Save
      try {
        await api.post('/opportunities/save', { opportunity_id: oppId });
        setSavedIds(prev => new Set(prev).add(oppId));
        showToast(`Saved '${opp.title}' to your shortlist!`);
      } catch (e) {
        // ignore
      }
    }
  };

  const isValidHttpUrl = (urlString) => {
    if (!urlString || typeof urlString !== 'string') return false;
    const trimmed = urlString.trim();
    if (!trimmed || trimmed === '#' || trimmed.toLowerCase().includes('example.com')) {
      return false;
    }
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleApply = async (opp) => {
    // Validate the URL — reject empty strings, placeholder example.com, and non-http(s) schemas
    const rawUrl = opp?.apply_url;
    if (!isValidHttpUrl(rawUrl)) {
      showToast('Application link currently unavailable', 'warning');
      return;
    }

    const targetUrl = rawUrl.trim();

    if (isAuthenticated) {
      // Track in student's application tracking system
      try {
        await api.post('/applications', {
          opportunity_id: opp._id || opp.id,
          title: opp.title,
          company: opp.company,
          type: opp.type,
          status: 'Applied',
        });
        showToast(`Tracked application for '${opp.company}' in My Applications!`, 'success');
      } catch (e) {
        // ignore
      }
    }
    // Open external verified application URL in a new tab safely
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          {toastType === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Jobs & Internships</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
            {total} Opportunities
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore verified positions matching your college degree and technical competencies.
        </p>
      </div>

      {/* Search & Filter Bar */}
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
              placeholder="Search by role title, company, technology (e.g. Python, React, Flask)..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters:</span>
          </div>

          {/* Type Filter */}
          <select
            value={oppType}
            onChange={(e) => { setOppType(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="internship">Internships</option>
            <option value="job">Full-time Jobs</option>
          </select>

          {/* Work Mode */}
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700"
          >
            <option value="all">All Work Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-Site</option>
          </select>

          {/* Experience */}
          <select
            value={experience}
            onChange={(e) => { setExperience(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700"
          >
            <option value="all">Any Experience Level</option>
            <option value="beginner">Entry Level / Beginner</option>
            <option value="intermediate">Intermediate</option>
          </select>

          {/* Beginner friendly checkbox */}
          <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-800 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={beginnerOnly}
              onChange={(e) => { setBeginnerOnly(e.target.checked); setPage(1); }}
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Beginner-Friendly Only</span>
          </label>
        </div>
      </section>

      {/* Opportunities Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Filtering verified opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No opportunities match these criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or clearing search keywords to see more roles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const oppId = opp._id || opp.id;
            const isSaved = savedIds.has(oppId);
            return (
              <div
                key={oppId}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {opp.type}
                    </span>
                    <button
                      onClick={() => handleSaveToggle(opp)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {opp.company}
                  </p>

                  <div className="mt-2.5 flex items-center space-x-3 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="capitalize">{opp.mode}</span> ({opp.location})
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Required Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(opp.required_skills || []).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Stipend / CTC</span>
                      <span className="font-bold text-emerald-600">{opp.stipend || 'Competitive'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Deadline</span>
                      <span className="font-bold text-slate-700">{opp.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => setSelectedOpp(opp)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApply(opp)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ${
                        isValidHttpUrl(opp.apply_url)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                      title={
                        isValidHttpUrl(opp.apply_url)
                          ? 'Apply on Official Portal'
                          : 'Application link currently unavailable'
                      }
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  {selectedOpp.type}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedOpp.title}</h2>
                <p className="text-xs text-slate-600 font-medium">{selectedOpp.company} • {selectedOpp.location}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Description</h4>
                <p className="leading-relaxed">{selectedOpp.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedOpp.required_skills || []).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Eligibility Criteria</h4>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedOpp.eligibility || 'Open to all enrolled undergraduate students with relevant projects.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium">Verified Source</span>
                  <span className="font-bold text-slate-800">{selectedOpp.source || 'Verified Partner Network'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Last Verified</span>
                  <span className="font-bold text-slate-800">{selectedOpp.last_verified || 'Recent'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  navigate(`/dashboard/skill-gap?target_opp=${selectedOpp._id}`);
                  setSelectedOpp(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Inspect Skill Gap Radar
              </button>

              {isValidHttpUrl(selectedOpp.apply_url) ? (
                <button
                  onClick={() => {
                    handleApply(selectedOpp);
                    setSelectedOpp(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Apply On Official Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApply(selectedOpp)}
                  className="px-6 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  title="Application link currently unavailable"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Application link currently unavailable</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
