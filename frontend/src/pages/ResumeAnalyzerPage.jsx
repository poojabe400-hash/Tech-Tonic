import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Sparkles,
  TrendingUp,
  FolderGit2,
  ShieldCheck,
  Award
} from 'lucide-react';

export const ResumeAnalyzerPage = () => {
  const { profile, updateLocalProfile } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [editableSkills, setEditableSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  useEffect(() => {
    fetchExistingAnalysis();
  }, []);

  const fetchExistingAnalysis = async () => {
    try {
      const res = await api.get('/resume/analysis');
      if (res.success && res.data) {
        setAnalysis(res.data);
        setEditableSkills(res.data.extracted_skills || []);
      }
    } catch (e) {
      // No resume yet
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorBanner('Only PDF documents are supported for resume extraction.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorBanner('PDF file size must be less than 10MB.');
        return;
      }
      setSelectedFile(file);
      setErrorBanner('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorBanner('Please select a PDF resume file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorBanner('');
    setSuccessBanner('');

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success && res.data) {
        setAnalysis(res.data.analysis);
        setEditableSkills(res.data.analysis.extracted_skills || []);
        setSuccessBanner('Resume parsed successfully! Skills extracted via NLP.');
      }
    } catch (err) {
      setErrorBanner(err.message || 'Error uploading or analyzing resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const s = newSkillInput.trim();
    if (!editableSkills.includes(s)) {
      setEditableSkills(prev => [...prev, s]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill) => {
    setEditableSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSaveConfirmedSkills = async () => {
    try {
      const res = await api.post('/resume/save-skills', { skills: editableSkills });
      if (res.success) {
        setSuccessBanner('Confirmed skills saved to your student profile! AI opportunity matching recalculated.');
        if (profile) {
          updateLocalProfile({
            ...profile,
            skills: res.data.skills,
            technical_skills: res.data.skills
          });
        }
        setTimeout(() => setSuccessBanner(''), 4000);
      }
    } catch (err) {
      setErrorBanner(err.message || 'Error saving skills.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>AI Resume Analyzer</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
            NLP Skill Extraction
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload your resume in PDF format to automatically extract confirmed programming languages, frameworks, and projects.
        </p>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {errorBanner && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Upload Box */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50">
            <UploadCloud className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">
              {selectedFile ? selectedFile.name : 'Choose your PDF resume or drag and drop'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports searchable PDF documents up to 10MB
            </p>

            <label className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-all shadow-2xs">
              <span>Select PDF Resume</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Extracting Skills via NLP...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Run Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Extracted Skills with Editable Correction */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span>Extracted Skills</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                    {editableSkills.length} Detected
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review and manually correct extracted skills before syncing with your student profile.
                </p>
              </div>

              <button
                onClick={handleSaveConfirmedSkills}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save to Profile</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {editableSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 cursor-pointer ml-1 text-slate-400"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add extra manual skill */}
            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md pt-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Missing a skill? Type and add..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>
          </section>

          {/* Breakdown Grid: Technical Strengths, Detected Projects, Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technical Strengths */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Technical Strengths</h4>
              </div>

              <div className="space-y-2.5">
                {(analysis.technical_strengths || []).map((str, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs text-emerald-900 font-medium">
                    ✓ {str}
                  </div>
                ))}
              </div>
            </div>

            {/* Detected Projects */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Detected Projects</h4>
              </div>

              <div className="space-y-2">
                {(analysis.detected_projects || []).length === 0 ? (
                  <p className="text-xs text-slate-400">No project titles explicitly identified.</p>
                ) : (
                  (analysis.detected_projects || []).map((proj, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold">
                      • {proj}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Resume Improvement Suggestions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Improvement Tips</h4>
              </div>

              <div className="space-y-2.5">
                {(analysis.improvement_suggestions || []).map((sug, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 font-medium leading-relaxed">
                    💡 {sug}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
