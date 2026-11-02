import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Scale,
  Sparkles,
  BookOpen,
  Award,
  Globe,
  CheckCircle2,
  Filter,
  ExternalLink,
  HeartHandshake,
  DollarSign,
  Layers,
  ArrowRight
} from 'lucide-react';

export const OpportunityEqualizerPage = () => {
  const [equalizerData, setEqualizerData] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'internships', 'courses', 'scholarships'
  const [filterRemoteOnly, setFilterRemoteOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEqualizerFeed();
  }, []);

  const fetchEqualizerFeed = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/equalizer');
      if (res.success && res.data) {
        setEqualizerData(res.data);
      }
    } catch (e) {
      console.warn('Equalizer feed error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const opps = equalizerData?.accessible_opportunities || [];
  const courses = equalizerData?.free_certifications_and_courses || [];
  const scholarships = equalizerData?.scholarships || [];

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

  const filteredOpps = filterRemoteOnly ? opps.filter(o => o.mode === 'remote') : opps;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Opportunity Equalizer</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
            Flagship Innovation
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Democratizing career access with beginner-friendly internships, free verified certifications, and zero-barrier scholarships.
        </p>
      </div>

      {/* Philosophy Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-purple-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-200">
              The Equalizer Manifesto
            </h3>
            <p className="text-xs text-slate-300">
              Every student deserves equal access to employment regardless of college tier or background.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          "{equalizerData?.philosophy || 'Democratizing career access: Every student deserves high-quality opportunities regardless of college tier, geography, or socioeconomic background.'}"
        </p>

        <div className="flex flex-wrap gap-3 pt-1 text-xs">
          <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/10 font-semibold">
            ✓ Zero College Tier Exclusion
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/10 font-semibold">
            ✓ 100% Free Verified Learning Paths
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-purple-300 border border-white/10 font-semibold">
            ✓ Accessible Remote Internships
          </span>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Equalizer Resources', count: (opps.length + courses.length + scholarships.length) },
            { id: 'internships', label: 'Beginner & Remote Internships', count: opps.length },
            { id: 'courses', label: 'Free Certifications', count: courses.length },
            { id: 'scholarships', label: 'Scholarships & Grants', count: scholarships.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer self-start sm:self-auto">
          <input
            type="checkbox"
            checked={filterRemoteOnly}
            onChange={(e) => setFilterRemoteOnly(e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
          />
          <span>Remote-Only Opportunities</span>
        </label>
      </div>

      {/* Content Feed */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading Equalizer curated catalog...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Beginner-Friendly & Remote Internships */}
          {(activeTab === 'all' || activeTab === 'internships') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span>Beginner-Friendly & Remote Internships</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">{filteredOpps.length} roles found</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOpps.map(opp => (
                  <div
                    key={opp._id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Beginner Friendly
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 capitalize">
                          {opp.mode}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{opp.title}</h4>
                      <p className="text-xs text-slate-600 font-medium">{opp.company}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{opp.description}</p>

                      <div className="mt-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-200/60 text-[11px] text-purple-900 font-medium">
                        💡 <strong>Why Recommended:</strong> Open to all college majors; prioritizes demonstrated project enthusiasm over formal brand-name pedigrees.
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">{opp.stipend || 'Stipend Provided'}</span>
                      {isValidHttpUrl(opp.apply_url) ? (
                        <a
                          href={opp.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span
                          title="Application link currently unavailable"
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 font-semibold text-[11px] select-none"
                        >
                          Application link currently unavailable
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Free Certifications & Learning */}
          {(activeTab === 'all' || activeTab === 'courses') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Free High-Value Certifications & Curricula</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">{courses.length} courses found</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((res, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {res.category}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">
                          {res.cost}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{res.title}</h4>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">{res.platform}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{res.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5"
                      >
                        <span>Access Free Course</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Scholarships & Grants */}
          {(activeTab === 'all' || activeTab === 'scholarships') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Verified Scholarships & Direct Tech Grants</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">{scholarships.length} scholarships found</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {scholarships.map((sc, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {sc.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          {sc.amount}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{sc.title}</h4>
                      <p className="text-xs text-slate-600 font-semibold">{sc.provider}</p>
                      <p className="text-xs text-slate-500 mt-2">{sc.description}</p>

                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                        <strong>Eligibility:</strong> {sc.eligibility}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-600">Due: {sc.deadline}</span>
                      <a
                        href={sc.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1"
                      >
                        <span>Apply for Grant</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
