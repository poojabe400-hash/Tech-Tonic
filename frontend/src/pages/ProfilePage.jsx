import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  School,
  BookOpen,
  Code2,
  FolderGit2,
  Award,
  Compass,
  Link,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile, updateLocalProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    college: '',
    degree: 'B.Tech',
    branch: '',
    current_semester: '',
    graduation_year: '2026',
    skills: [],
    technical_skills: [],
    soft_skills: [],
    projects: [],
    certifications: [],
    areas_of_interest: [],
    preferred_job_roles: [],
    preferred_work_mode: 'remote',
    preferred_location: '',
    career_goals: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newRole, setNewRole] = useState('');

  // Project Modal / Inline State
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: ''
  });
  const [showAddProject, setShowAddProject] = useState(false);

  // Certification Inline State
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    credential_url: ''
  });
  const [showAddCert, setShowAddCert] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/student/profile');
      if (res.success && res.data) {
        setFormData({
          ...res.data,
          skills: res.data.skills || [],
          technical_skills: res.data.technical_skills || res.data.skills || [],
          soft_skills: res.data.soft_skills || [],
          projects: res.data.projects || [],
          certifications: res.data.certifications || [],
          areas_of_interest: res.data.areas_of_interest || [],
          preferred_job_roles: res.data.preferred_job_roles || [],
        });
      }
    } catch (e) {
      console.warn('Profile fetch:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const s = newSkill.trim();
    if (!formData.skills.includes(s)) {
      const updated = [...formData.skills, s];
      setFormData(prev => ({
        ...prev,
        skills: updated,
        technical_skills: updated
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = formData.skills.filter(s => s !== skillToRemove);
    setFormData(prev => ({
      ...prev,
      skills: updated,
      technical_skills: updated
    }));
  };

  const handleAddSoftSkill = (e) => {
    e.preventDefault();
    if (!newSoftSkill.trim()) return;
    const s = newSoftSkill.trim();
    if (!formData.soft_skills.includes(s)) {
      setFormData(prev => ({ ...prev, soft_skills: [...prev.soft_skills, s] }));
    }
    setNewSoftSkill('');
  };

  const handleRemoveSoftSkill = (s) => {
    setFormData(prev => ({ ...prev, soft_skills: prev.soft_skills.filter(item => item !== s) }));
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    const item = newInterest.trim();
    if (!formData.areas_of_interest.includes(item)) {
      setFormData(prev => ({ ...prev, areas_of_interest: [...prev.areas_of_interest, item] }));
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (item) => {
    setFormData(prev => ({ ...prev, areas_of_interest: prev.areas_of_interest.filter(i => i !== item) }));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    const r = newRole.trim();
    if (!formData.preferred_job_roles.includes(r)) {
      setFormData(prev => ({ ...prev, preferred_job_roles: [...prev.preferred_job_roles, r] }));
    }
    setNewRole('');
  };

  const handleRemoveRole = (r) => {
    setFormData(prev => ({ ...prev, preferred_job_roles: prev.preferred_job_roles.filter(item => item !== r) }));
  };

  // Projects CRUD
  const handleSaveProject = () => {
    if (!projectForm.title.trim()) return;
    const techArray = projectForm.technologies
      ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const newProj = {
      ...projectForm,
      technologies: techArray
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    setProjectForm({ title: '', description: '', technologies: '', github_url: '', live_url: '' });
    setShowAddProject(false);
  };

  const handleRemoveProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Certifications CRUD
  const handleSaveCert = () => {
    if (!certForm.name.trim()) return;
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...certForm }]
    }));
    setCertForm({ name: '', issuer: '', issue_date: '', credential_url: '' });
    setShowAddCert(false);
  };

  const handleRemoveCert = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Save full profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorBanner('');
    setSuccessBanner('');
    try {
      const res = await api.put('/student/profile', formData);
      if (res.success && res.data) {
        setSuccessBanner('Your student profile was updated successfully! AI matching scores updated.');
        updateLocalProfile(res.data);
        setTimeout(() => setSuccessBanner(''), 4000);
      }
    } catch (e) {
      setErrorBanner(e.message || 'Error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading your profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Student Profile Builder</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
              Always Editable
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your skills, projects, and academic details updated for high-precision AI matching.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications / Alerts */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {errorBanner && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      {/* 1. Academic & Personal Information */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Academic & Personal Details</h2>
            <p className="text-xs text-slate-500">Your university background and graduation timeline</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. National Institute of Technology"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Degree</label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              <option value="B.Tech">Bachelor of Technology (B.Tech)</option>
              <option value="B.E.">Bachelor of Engineering (B.E.)</option>
              <option value="BCA">Bachelor of Computer Applications (BCA)</option>
              <option value="MCA">Master of Computer Applications (MCA)</option>
              <option value="B.Sc CS/IT">B.Sc Computer Science / IT</option>
              <option value="M.Tech">M.Tech / M.S.</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Branch / Major</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Semester / Year</label>
            <input
              type="text"
              name="current_semester"
              value={formData.current_semester}
              onChange={handleChange}
              placeholder="e.g. 6th Semester"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
            <select
              name="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Technical Skills & Soft Skills */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Technical Skills & Competencies</h2>
            <p className="text-xs text-slate-500">Skills are weighted heavily (60%) in AI Opportunity Matching</p>
          </div>
        </div>

        {/* Technical Skills Tag Manager */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Technical Skills & Frameworks</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600 cursor-pointer ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. React.js, Docker, Python"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Soft Skills */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-2">Soft Skills & Leadership</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.soft_skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSoftSkill(skill)}
                  className="hover:text-rose-600 cursor-pointer ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSoftSkill} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newSoftSkill}
              onChange={(e) => setNewSoftSkill(e.target.value)}
              placeholder="e.g. Problem Solving, Team Leadership"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </section>

      {/* 3. Projects Portfolio */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hands-on Projects</h2>
              <p className="text-xs text-slate-500">Add practical projects with GitHub or live deployment links</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddProject(!showAddProject)}
            className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddProject ? 'Cancel' : 'Add Project'}</span>
          </button>
        </div>

        {/* Add Project Form Drawer */}
        {showAddProject && (
          <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200/80 space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold text-cyan-950 uppercase tracking-wider">New Project Entry</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Campus Marketplace Web App"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="e.g. React.js, Flask, MongoDB, Tailwind"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Description</label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the problem solved, architecture, and impact..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, github_url: e.target.value }))}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={projectForm.live_url}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, live_url: e.target.value }))}
                  placeholder="https://demo.vercel.app"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveProject}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Add Project to Portfolio
            </button>
          </div>
        )}

        {/* Current Projects List */}
        <div className="space-y-3">
          {formData.projects.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No projects added yet. Click 'Add Project' to showcase your code.</p>
          ) : (
            formData.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-xs text-slate-600">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(proj.technologies || []).map((t, ti) => (
                      <span key={ti} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
                    >
                      <span>Code</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleRemoveProject(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. Certifications */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Certifications & Credentials</h2>
              <p className="text-xs text-slate-500">FreeCodeCamp, AWS, Coursera, Kaggle certificates</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddCert(!showAddCert)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddCert ? 'Cancel' : 'Add Certification'}</span>
          </button>
        </div>

        {showAddCert && (
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Certification Name *</label>
                <input
                  type="text"
                  value={certForm.name}
                  onChange={(e) => setCertForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issuer *</label>
                <input
                  type="text"
                  value={certForm.issuer}
                  onChange={(e) => setCertForm(prev => ({ ...prev, issuer: e.target.value }))}
                  placeholder="e.g. FreeCodeCamp / MongoDB"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                <input
                  type="text"
                  value={certForm.issue_date}
                  onChange={(e) => setCertForm(prev => ({ ...prev, issue_date: e.target.value }))}
                  placeholder="YYYY-MM"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Credential Link</label>
                <input
                  type="url"
                  value={certForm.credential_url}
                  onChange={(e) => setCertForm(prev => ({ ...prev, credential_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCert}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Save Certificate
            </button>
          </div>
        )}

        <div className="space-y-3">
          {formData.certifications.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No certifications added yet.</p>
          ) : (
            formData.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{cert.name}</h4>
                  <p className="text-[11px] text-slate-500">{cert.issuer} • {cert.issue_date || 'Verified'}</p>
                </div>
                <button
                  onClick={() => handleRemoveCert(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Career Preferences & External Profiles */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Career Preferences & Portfolio Links</h2>
            <p className="text-xs text-slate-500">Target roles, work modes, and verified public profiles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Work Mode</label>
            <select
              name="preferred_work_mode"
              value={formData.preferred_work_mode}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              <option value="remote">Remote First</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-Site</option>
              <option value="any">Flexible / Any</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Location</label>
            <input
              type="text"
              name="preferred_location"
              value={formData.preferred_location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru, Hyderabad, Remote"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Personal Portfolio URL</label>
            <input
              type="url"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="https://yourname.dev"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* Floating Save Button Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="text-xs">
          <p className="font-bold">Finished editing your details?</p>
          <p className="text-slate-400">Save to recalculate all opportunity match scores.</p>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-60"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
