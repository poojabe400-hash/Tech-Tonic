import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  BarChart3,
  Compass,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save
} from 'lucide-react';

export const SkillGapPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile, updateLocalProfile } = useAuth();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(searchParams.get('target_opp') || '');
  const [skillGapData, setSkillGapData] = useState(null);
  const [customProficiencies, setCustomProficiencies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    fetchSkillGap();
  }, [selectedOppId]);

  const loadOpportunities = async () => {
    try {
      const res = await api.get('/opportunities?limit=25');
      if (res.success && res.data) {
        setOpportunities(res.data.items || []);
        if (!selectedOppId && res.data.items.length > 0) {
          setSelectedOppId(res.data.items[0]._id || res.data.items[0].id);
        }
      }
    } catch (e) {
      console.warn('Opps load:', e);
    }
  };

  const fetchSkillGap = async (proficienciesOverride = null) => {
    setIsLoading(true);
    try {
      const payload = {
        opportunity_id: selectedOppId,
        custom_proficiencies: proficienciesOverride || customProficiencies
      };
      const res = await api.post('/ai/skill-gap', payload);
      if (res.success && res.data) {
        setSkillGapData(res.data);

        // Prepopulate proficiencies from returned breakdown if empty
        if (Object.keys(customProficiencies).length === 0) {
          const map = {};
          (res.data.skill_breakdown || []).forEach(item => {
            map[item.skill] = item.proficiency;
          });
          setCustomProficiencies(map);
        }
      }
    } catch (e) {
      console.warn('Skill gap error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProficiencyChange = (skillName, newScore) => {
    const updated = {
      ...customProficiencies,
      [skillName]: Number(newScore)
    };
    setCustomProficiencies(updated);
    // Instant live preview
    fetchSkillGap(updated);
  };

  const handleSaveProficiencies = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/student/profile', {
        skill_proficiencies: customProficiencies
      });
      if (res.success) {
        setSuccessBanner('Updated skill proficiencies saved to your profile!');
        if (profile) {
          updateLocalProfile({
            ...profile,
            skill_proficiencies: customProficiencies
          });
        }
        setTimeout(() => setSuccessBanner(''), 3500);
      }
    } catch (e) {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  const currentOpp = opportunities.find(o => (o._id || o.id) === selectedOppId);

  // Format data for Recharts
  const chartData = (skillGapData?.skill_breakdown || []).map(item => ({
    name: item.skill,
    YourProficiency: item.proficiency,
    BenchmarkRequired: item.benchmark_required || 75,
    Gap: item.gap
  }));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Skill Gap Analyzer</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
            Interactive Deficit Radar
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compare your current technical competencies against benchmark hiring requirements for target opportunities.
        </p>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Target Opportunity Selector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Target Opportunity for Analysis:
          </label>
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:bg-white max-w-md w-full"
          >
            {opportunities.map(opp => (
              <option key={opp._id || opp.id} value={opp._id || opp.id}>
                {opp.title} — {opp.company} ({opp.type})
              </option>
            ))}
          </select>
        </div>

        {/* Generate Roadmap Button */}
        <button
          onClick={() => navigate(`/dashboard/career-gps?role=${encodeURIComponent(currentOpp?.title || 'Full Stack Developer')}`)}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center space-x-2 transition-all hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Generate My Learning Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Stat Cards */}
      {skillGapData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Readiness Overlap
            </span>
            <p className="text-3xl font-black text-slate-900 mt-2">
              {skillGapData.overall_readiness_pct}%
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {skillGapData.skills_acquired_count} of {skillGapData.total_required_count} target skills covered
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Skills Acquired
            </span>
            <p className="text-3xl font-black text-emerald-600 mt-2">
              {skillGapData.skills_acquired_count}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
              Ready or In Progress
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Missing Deficit
            </span>
            <p className="text-3xl font-black text-amber-600 mt-2">
              {skillGapData.skills_missing_count}
            </p>
            <p className="text-[11px] text-amber-700 mt-1 font-semibold">
              Prioritize in Career GPS
            </p>
          </div>
        </div>
      )}

      {/* Interactive Chart Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Skill Proficiency vs Industry Benchmark (75%)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Blue bars represent your current proficiency; dashed line shows competitive benchmark.
            </p>
          </div>

          <button
            onClick={handleSaveProficiencies}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Custom Proficiencies</span>
          </button>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(val, name) => [`${val}%`, name === 'YourProficiency' ? 'Your Proficiency' : 'Benchmark Required']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={75} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Ready (75%)', position: 'top', fill: '#10b981', fontSize: 11 }} />
              <Bar dataKey="YourProficiency" name="Your Proficiency" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manual Proficiency Sliders */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <span>Update Your Proficiency Levels Manually</span>
          </h3>
          <p className="text-xs text-slate-500">
            Adjust the sliders to calibrate your real-world level of confidence in each required technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {(skillGapData?.skill_breakdown || []).map((item) => {
            const currentVal = customProficiencies[item.skill] ?? item.proficiency;
            return (
              <div
                key={item.skill}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                  <span className={`text-xs font-extrabold ${
                    currentVal >= 70 ? 'text-emerald-600' : currentVal >= 40 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {currentVal}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={currentVal}
                  onChange={(e) => handleProficiencyChange(item.skill, e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Beginner (20%)</span>
                  <span>Intermediate (60%)</span>
                  <span>Expert (90%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Suggestions */}
      {skillGapData?.suggestions && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Tailored Improvement Plan</span>
          </h3>

          <div className="space-y-3">
            {skillGapData.suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sug.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {sug.priority} Priority
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{sug.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sug.description}</p>
                </div>

                <button
                  onClick={() => navigate(`/dashboard/career-gps?role=${encodeURIComponent(currentOpp?.title || 'Full Stack Developer')}`)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  View In Career GPS →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
