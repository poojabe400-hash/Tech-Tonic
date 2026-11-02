import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  Sparkles,
  Award,
  FolderGit2,
  Code2,
  FileText,
  Compass,
  ArrowRight,
  Sliders,
  CheckCircle2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const CareerReadinessPage = () => {
  const { profile } = useAuth();

  const [currentReadiness, setCurrentReadiness] = useState(null);
  const [simulatedScore, setSimulatedScore] = useState(null);
  const [scoreGain, setScoreGain] = useState(0);

  // Simulation what-if controls
  const [simSkills, setSimSkills] = useState(['Docker', 'FastAPI']);
  const [simProjects, setSimProjects] = useState(1);
  const [simCerts, setSimCerts] = useState(1);
  const [simLearningBoost, setSimLearningBoost] = useState(20);

  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchBaseReadiness();
  }, []);

  const fetchBaseReadiness = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/ai/readiness');
      if (res.success && res.data) {
        setCurrentReadiness(res.data);
        runSimulation(res.data, simSkills, simProjects, simCerts, simLearningBoost);
      }
    } catch (e) {
      console.warn('Readiness fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const runSimulation = async (baseData, skills, projects, certs, boost) => {
    setIsSimulating(true);
    try {
      const res = await api.post('/ai/simulate-readiness', {
        simulated_skills: skills,
        simulated_projects_count: projects,
        simulated_certifications_count: certs,
        simulated_learning_boost: boost,
      });

      if (res.success && res.data) {
        setSimulatedScore(res.data.simulated);
        setScoreGain(res.data.score_gain);

        if (res.data.score_gain > 15) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      console.warn('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateUpdate = (newSkills, newProjects, newCerts, newBoost) => {
    setSimSkills(newSkills);
    setSimProjects(newProjects);
    setSimCerts(newCerts);
    setSimLearningBoost(newBoost);
    runSimulation(currentReadiness, newSkills, newProjects, newCerts, newBoost);
  };

  if (isLoading || !currentReadiness) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Calculating Career Readiness metrics...</p>
      </div>
    );
  }

  const breakdown = currentReadiness.breakdown || {};

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Career Readiness Simulator</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
            Interactive What-If Engine
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          An illustrative learning-progress indicator evaluating skills, projects, certifications, and roadmap execution.
        </p>
      </div>

      {/* Primary Score Comparison: Current vs Simulated */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Verified Score */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Verified Readiness
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {currentReadiness.tier}
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-5xl font-black text-slate-900">{currentReadiness.score}</span>
            <span className="text-base font-bold text-slate-400">/ 100</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Derived directly from your {currentReadiness.stats?.skills_count || 5} confirmed technical skills, {currentReadiness.stats?.projects_count || 2} projects, and verified credentials.
          </p>

          {/* Breakdown progress bars */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            {Object.entries(breakdown).map(([key, item]) => (
              <div key={key}>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{item.label}</span>
                  <span>{item.score} / {item.max} pts</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projected Simulated Score */}
        <div className="bg-gradient-to-tr from-blue-900 via-indigo-950 to-slate-950 p-7 rounded-3xl text-white shadow-xl border border-blue-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Projected What-If Score</span>
              </span>
              {scoreGain > 0 && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +{scoreGain} Projected Boost
                </span>
              )}
            </div>

            <div className="flex items-baseline space-x-3 mt-3">
              <span className="text-5xl font-black text-cyan-300">
                {simulatedScore?.score || currentReadiness.score}
              </span>
              <span className="text-base font-bold text-slate-400">/ 100</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              If you complete {simProjects} new portfolio project, acquire {simSkills.length} in-demand skills, and finish {simCerts} free certification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200 space-y-1.5">
            <p className="font-bold text-white">Impact Analysis:</p>
            <p>
              Your projected readiness tier advances to <strong>{simulatedScore?.tier || currentReadiness.tier}</strong>, opening up over 80%+ match rate for software engineering internships.
            </p>
          </div>
        </div>
      </div>

      {/* What-If Interactive Controls */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Simulate Your Next Milestones</h3>
            <p className="text-xs text-slate-500">Test how completing recommended projects or learning new skills elevates your readiness</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Projects Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-1.5">
                <FolderGit2 className="w-4 h-4 text-cyan-600" />
                <span>Simulate Adding Projects</span>
              </span>
              <span className="text-blue-600">+{simProjects} Project(s)</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={simProjects}
              onChange={(e) => handleSimulateUpdate(simSkills, Number(e.target.value), simCerts, simLearningBoost)}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">+12 to +25 pts towards portfolio readiness</span>
          </div>

          {/* Certifications Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Free Certifications</span>
              </span>
              <span className="text-blue-600">+{simCerts} Course(s)</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={simCerts}
              onChange={(e) => handleSimulateUpdate(simSkills, simProjects, Number(e.target.value), simLearningBoost)}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">+8 to +15 pts for verified credential completion</span>
          </div>

          {/* Learning Progress Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Roadmap Progress</span>
              </span>
              <span className="text-blue-600">+{simLearningBoost}% Done</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="10"
              value={simLearningBoost}
              onChange={(e) => handleSimulateUpdate(simSkills, simProjects, simCerts, Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Completing weekly Career GPS action milestones</span>
          </div>
        </div>
      </section>

      {/* Actionable Recommendations */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>High-Yield Improvement Suggestions</span>
        </h3>

        <div className="space-y-3">
          {(currentReadiness.recommendations || []).map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-start space-x-3 text-xs text-blue-950 font-medium leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 text-[11px] text-slate-400 italic">
          * {currentReadiness.disclaimer}
        </div>
      </section>
    </div>
  );
};
