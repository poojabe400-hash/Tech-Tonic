import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Compass,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';

export const OpportunityMatchingPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterThreshold, setFilterThreshold] = useState(50); // Minimum match %

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/ai/recommendations');
      if (res.success && res.data) {
        setRecommendations(res.data);
      }
    } catch (e) {
      console.warn('Matching recommendations error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOpps = recommendations.filter(
    (item) => (item.match_score || 0) >= filterThreshold
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>AI Opportunity Matching Engine</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
            Weighted Formula
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Objective evaluation comparing your confirmed skills, education, and interests against live opportunity requirements.
        </p>
      </div>

      {/* Formula Explanation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-blue-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Scoring Mathematical Formula
            </h3>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-white/10 text-cyan-300 font-medium">
            100% Demographic Neutral
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-mono text-cyan-200">
          Match Score = (0.60 × Skill Match) + (0.20 × Education Eligibility) + (0.10 × Interest Match) + (0.10 × Location/Work Mode)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-semibold">Weight: 60%</span>
            <span className="font-bold text-white">Skills Match</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-semibold">Weight: 20%</span>
            <span className="font-bold text-white">Education Criteria</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-semibold">Weight: 10%</span>
            <span className="font-bold text-white">Career Interests</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-semibold">Weight: 10%</span>
            <span className="font-bold text-white">Location & Mode</span>
          </div>
        </div>
      </div>

      {/* Threshold Filter Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-bold text-slate-700">Filter Minimum Match Score:</span>
          <div className="flex items-center space-x-1.5">
            {[40, 60, 75, 85].map((threshold) => (
              <button
                key={threshold}
                onClick={() => setFilterThreshold(threshold)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterThreshold === threshold
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {threshold}%+
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredOpps.length}</strong> matching opportunities
        </p>
      </div>

      {/* Recommendations List with Transparent Explanations */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Computing personalized weighted match scores...</p>
        </div>
      ) : filteredOpps.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No opportunities exceed {filterThreshold}% match</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try lowering the threshold or updating your confirmed skills in the Profile Builder.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOpps.map((opp) => {
            const details = opp.match_details || {};
            const score = opp.match_score || 0;

            return (
              <div
                key={opp._id || opp.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {opp.type}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 capitalize">
                        {opp.mode} • {opp.location}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                      {opp.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600">
                      {opp.company} • Stipend: <span className="text-emerald-600">{opp.stipend || 'Competitive'}</span>
                    </p>
                  </div>

                  {/* Match Pill */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between self-stretch sm:self-auto p-3 sm:p-0 rounded-2xl bg-slate-50 sm:bg-transparent">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Overall Match
                    </span>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-2xl sm:text-3xl font-black ${
                        score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weighted Sub-Scores Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-medium">Skill Overlap (60%)</span>
                    <span className="font-bold text-slate-800">{details.skill_score || 0}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Education (20%)</span>
                    <span className="font-bold text-slate-800">{details.education_score || 100}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Interests (10%)</span>
                    <span className="font-bold text-slate-800">{details.interest_score || 70}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Location/Mode (10%)</span>
                    <span className="font-bold text-slate-800">{details.location_score || 100}%</span>
                  </div>
                </div>

                {/* Transparent Explanations Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Strong Matches */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                    <h4 className="font-bold text-emerald-950 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Why This Matches You</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(details.matched_skills || []).length === 0 ? (
                        <p className="text-slate-500 italic">No exact skill overlaps yet.</p>
                      ) : (
                        (details.matched_skills || []).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white text-emerald-800 font-semibold border border-emerald-200 text-[10px]">
                            ✓ {s}
                          </span>
                        ))
                      )}
                    </div>
                    {(details.why_matched || []).map((reason, rIdx) => (
                      <p key={rIdx} className="text-emerald-900/90 text-[11px] leading-relaxed">
                        • {reason}
                      </p>
                    ))}
                  </div>

                  {/* Missing Skills & Actionable Improvements */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                    <h4 className="font-bold text-amber-950 flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Missing Skills to Acquire</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(details.missing_skills || []).length === 0 ? (
                        <span className="text-emerald-700 font-semibold text-[11px]">You have all primary required skills!</span>
                      ) : (
                        (details.missing_skills || []).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white text-amber-800 font-semibold border border-amber-200 text-[10px]">
                            Missing: {s}
                          </span>
                        ))
                      )}
                    </div>
                    {(details.improvement_suggestions || []).map((tip, tIdx) => (
                      <p key={tIdx} className="text-amber-900/90 text-[11px] leading-relaxed">
                        💡 {tip}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Disclaimer: Recommendation indicator to guide learning, not an automated hiring probability.
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard/skill-gap?target_opp=${opp._id || opp.id}`)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>View My Skill Gap</span>
                    </button>

                    <button
                      onClick={() => navigate(`/dashboard/career-gps?role=${encodeURIComponent(opp.title)}`)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Generate Roadmap</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
