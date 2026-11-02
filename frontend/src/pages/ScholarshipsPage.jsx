import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Award,
  ExternalLink,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/scholarships');
      if (res.success && res.data) {
        setScholarships(res.data);
      }
    } catch (e) {
      console.warn('Scholarships error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = scholarships.filter(s =>
    search ? (s.title + ' ' + s.provider + ' ' + s.description).toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Scholarships & Career Programs</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
            Financial Accessibility
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore merit, diversity, hardware subsidies, and conference travel grants designed for engineering students.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex items-center">
        <Search className="w-4 h-4 text-slate-400 ml-2 mr-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scholarships by provider, program name, or focus area..."
          className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
        />
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading verified scholarships...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {item.category}
                  </span>
                  <span className="text-xs font-black text-emerald-600">
                    {item.amount}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 font-semibold">{item.provider}</p>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{item.description}</p>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Eligibility:</span>
                  <span>{item.eligibility}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600">Due: {item.deadline}</span>
                <a
                  href={item.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Apply on Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
