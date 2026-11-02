import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Calendar,
  CheckCircle2,
  Bookmark,
  Compass,
  BarChart3,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Award,
  Layers,
  AlertCircle
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/student/dashboard');
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerCelebrate = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading your personalized AI dashboard...</p>
      </div>
    );
  }

  const readiness = dashboardData?.readiness || { score: 65, tier: 'Developing Foundations', breakdown: {} };
  const opps = dashboardData?.top_recommended_opportunities || [];
  const events = dashboardData?.upcoming_events || [];
  const appStats = dashboardData?.applications_stats || { total: 0, applied: 0, under_review: 0, interview: 0, selected: 0 };
  const roadmapPreview = dashboardData?.roadmap_preview;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#2563EB] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Campus-to-Employment Readiness Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {dashboardData?.student_name || 'Student'}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We don't just help you find jobs. We help you become <strong>ready</strong> for jobs. Here is your current career intelligence breakdown.
            </p>

            {/* Profile Completion Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Profile Completion</span>
                <span className="text-cyan-300">{dashboardData?.profile_completion_pct || 65}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-700"
                  style={{ width: `${dashboardData?.profile_completion_pct || 65}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <NavLink
              to="/dashboard/resume"
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition-all flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Upload / Parse Resume</span>
            </NavLink>

            <NavLink
              to="/dashboard/matching"
              className="px-4 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/30 text-xs font-bold transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>View All AI Matches</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Readiness Card */}
        <div
          onClick={() => navigate('/dashboard/skill-gap')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Readiness Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{readiness.score}</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {readiness.tier}
            </span>
            <span className="text-[11px] text-blue-600 font-semibold flex items-center">
              Inspect →
            </span>
          </div>
        </div>

        {/* Recommended Opps */}
        <div
          onClick={() => navigate('/dashboard/matching')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recommended Opps
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">
              {dashboardData?.total_recommended_count || opps.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">matched roles</span>
          </div>

          <p className="mt-2 text-[11px] text-slate-500 font-medium truncate">
            Based on current {profile?.skills?.length || 5} confirmed skills
          </p>
        </div>

        {/* Applications Tracker Card */}
        <div
          onClick={() => navigate('/dashboard/applications')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Applications
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{appStats.total}</span>
            <span className="text-xs text-slate-500 font-medium">tracked</span>
          </div>

          <p className="mt-2 text-[11px] text-purple-700 font-semibold">
            {appStats.under_review} Under Review • {appStats.interview} Interview
          </p>
        </div>

        {/* Saved Items */}
        <div
          onClick={() => navigate('/dashboard/saved')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shortlisted
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">
              {(dashboardData?.saved_opportunities_count || 0) + (dashboardData?.saved_events_count || 0)}
            </span>
            <span className="text-xs text-slate-500 font-medium">saved items</span>
          </div>

          <p className="mt-2 text-[11px] text-emerald-700 font-semibold">
            {dashboardData?.saved_opportunities_count || 0} jobs • {dashboardData?.saved_events_count || 0} events
          </p>
        </div>
      </div>

      {/* Main Content Grid: Top Opportunities & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Top 3 Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span>Top Recommended Opportunities</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  AI Matched
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Formula: (60% Skill) + (20% Education) + (10% Interest) + (10% Location/Mode)
              </p>
            </div>
            <NavLink
              to="/dashboard/jobs"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>

          <div className="space-y-3.5">
            {opps.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No matching opportunities found. Update your profile skills to unlock recommendations.
              </div>
            ) : (
              opps.map((opp) => (
                <div
                  key={opp._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                          {opp.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {opp.company} • <span className="capitalize">{opp.mode}</span> ({opp.location})
                      </p>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs font-bold uppercase text-slate-400 block leading-none">
                          Match Score
                        </span>
                        <span className="text-lg font-black text-blue-600 leading-none">
                          {opp.match_score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills tags: Matched vs Missing */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(opp.matched_skills || []).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{s}</span>
                      </span>
                    ))}
                    {(opp.missing_skills || []).slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1"
                      >
                        <span>Missing: {s}</span>
                      </span>
                    ))}
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      Stipend: <span className="text-emerald-600">{opp.stipend || 'Competitive'}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/skill-gap?target_opp=${opp._id}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        View My Skill Gap
                      </button>
                      <NavLink
                        to={`/dashboard/jobs`}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        Apply / Details
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Events & Roadmap Preview */}
        <div className="space-y-6">
          {/* Upcoming Events Box */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Upcoming Hackathons & Events</span>
              </h3>
              <NavLink to="/dashboard/events" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                All Events →
              </NavLink>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50/40 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {ev.category}
                    </span>
                    <span className="text-rose-600 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Due: {ev.registration_deadline}</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ev.title}</h4>
                  <p className="text-[11px] text-slate-500">{ev.organizer} • {ev.format}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career GPS Roadmap Snippet */}
          {roadmapPreview && (
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-5 rounded-3xl text-white shadow-lg space-y-4 border border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-cyan-300" />
                  <div>
                    <h3 className="text-sm font-bold">Career GPS Roadmap</h3>
                    <p className="text-[11px] text-slate-300">Target: {roadmapPreview.target_role}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Week {roadmapPreview.current_week}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                <p className="text-xs font-bold text-white">{roadmapPreview.week_title}</p>
                <div className="space-y-1.5 text-xs text-slate-200">
                  {(roadmapPreview.tasks || []).slice(0, 2).map((t, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <NavLink
                to="/dashboard/career-gps"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
              >
                <span>Open Full 6-Week Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
