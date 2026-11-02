import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Award,
  Layers
} from 'lucide-react';

export const CareerGpsPage = () => {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();

  const [targetRole, setTargetRole] = useState(
    searchParams.get('role') || (profile?.preferred_job_roles?.[0] || 'Full Stack Developer')
  );
  const [roadmap, setRoadmap] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [completedWeeks, setCompletedWeeks] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, [targetRole]);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/ai/roadmap', {
        target_role: targetRole,
        missing_skills: profile?.skills ? ['Docker', 'SQL', 'FastAPI'] : []
      });
      if (res.success && res.data) {
        setRoadmap(res.data);
      }
    } catch (e) {
      console.warn('Roadmap error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (taskKey, weekNum) => {
    const nextTasks = new Set(completedTasks);
    if (nextTasks.has(taskKey)) {
      nextTasks.delete(taskKey);
    } else {
      nextTasks.add(taskKey);
      // Small celebratory burst on task check
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
    setCompletedTasks(nextTasks);

    // Check if entire week is completed
    const currentWeekData = roadmap?.weeks?.find(w => w.week === weekNum);
    if (currentWeekData) {
      const allDone = currentWeekData.tasks.every(t => nextTasks.has(`${weekNum}-${t}`));
      setCompletedWeeks(prev => {
        const next = new Set(prev);
        if (allDone) next.add(weekNum);
        else next.delete(weekNum);
        return next;
      });
    }
  };

  // Calculate overall progress percentage
  const totalTasks = roadmap?.weeks?.reduce((acc, w) => acc + (w.tasks?.length || 0), 0) || 1;
  const progressPct = Math.round((completedTasks.size / totalTasks) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Career GPS — Personalized Learning Roadmap</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
            6-Week Structured Path
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Structured week-by-week learning plan targeting your missing skills with accessible, verified free resources.
        </p>
      </div>

      {/* Target Role Selector & Overall Progress Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0B132B] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-blue-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              Target Career Role
            </span>
            <div className="flex items-center space-x-2">
              <Compass className="w-6 h-6 text-cyan-400" />
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-white/10 border border-white/20 text-white font-bold text-base sm:text-lg rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="Full Stack Developer" className="text-slate-900">Full Stack Developer</option>
                <option value="Frontend React Developer" className="text-slate-900">Frontend React Developer</option>
                <option value="AI & Data Science Engineer" className="text-slate-900">AI & Data Science Engineer</option>
                <option value="Cloud & DevOps Engineer" className="text-slate-900">Cloud & DevOps Engineer</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Estimated Commitment
            </span>
            <p className="text-sm font-extrabold text-cyan-300">{roadmap?.estimated_hours || '55-65 hours total'}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Roadmap Completion Progress</span>
            <span className="text-cyan-300 font-bold">{progressPct}% ({completedTasks.size}/{totalTasks} tasks)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week by Week Curriculum Timeline */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Generating your personalized 6-week curriculum...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(roadmap?.weeks || []).map((week) => {
            const isWeekDone = completedWeeks.has(week.week);
            return (
              <div
                key={week.week}
                className={`bg-white rounded-3xl border transition-all p-6 sm:p-7 shadow-xs space-y-5 ${
                  isWeekDone
                    ? 'border-emerald-300 bg-emerald-50/15'
                    : 'border-slate-200/90 hover:shadow-md'
                }`}
              >
                {/* Week Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isWeekDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      W{week.week}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {week.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{week.duration}</span>
                        </span>
                        <span>•</span>
                        <span>Focus: <strong>{(week.focus_skills || []).join(', ')}</strong></span>
                      </div>
                    </div>
                  </div>

                  {isWeekDone && (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Week Completed</span>
                    </span>
                  )}
                </div>

                {/* Practical Learning Tasks with Interactive Checkboxes */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Weekly Action Items & Projects
                  </h4>
                  <div className="space-y-2">
                    {(week.tasks || []).map((task, tIdx) => {
                      const taskKey = `${week.week}-${task}`;
                      const isDone = completedTasks.has(taskKey);
                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTask(taskKey, week.week)}
                          className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-3 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                              : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 text-slate-800'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}} // handled by div
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                          />
                          <span className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Free Learning Resources */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Free Curated Resources for Week {week.week}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(week.resources || []).map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-between text-xs text-slate-800 font-semibold group"
                      >
                        <div className="truncate mr-2">
                          <p className="truncate group-hover:text-blue-700">{res.name}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{res.type}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </a>
                    ))}
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
