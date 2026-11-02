import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Building,
  Edit3,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  X
} from 'lucide-react';

const STATUS_COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Under Review', label: 'Under Review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Interview', label: 'Interview Scheduled', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Selected', label: 'Selected / Offer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Rejected', label: 'Archived / Rejected', color: 'bg-slate-100 text-slate-700 border-slate-200' }
];

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [newAppForm, setNewAppForm] = useState({
    title: '',
    company: '',
    type: 'internship',
    status: 'Applied',
    notes: '',
    next_deadline: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/applications');
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (e) {
      console.warn('Apps error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    if (!newAppForm.title.trim() || !newAppForm.company.trim()) return;

    try {
      const res = await api.post('/applications', newAppForm);
      if (res.success && res.data) {
        setApplications(prev => [res.data, ...prev]);
        setShowAddModal(false);
        setNewAppForm({ title: '', company: '', type: 'internship', status: 'Applied', notes: '', next_deadline: '' });
      }
    } catch (err) {
      alert(err.message || 'Error adding application.');
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}`, { status: newStatus });
      if (res.success && res.data) {
        setApplications(prev => prev.map(a => a._id === appId ? res.data : a));
      }
    } catch (e) {
      // ignore
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this tracked application?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      setApplications(prev => prev.filter(a => a._id !== appId));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Application Tracking System</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
              {applications.length} Tracked
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track upcoming rounds, interview schedules, notes, and milestones for all your internship and job applications.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-all hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Application</span>
        </button>
      </div>

      {/* Kanban Columns */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading applications...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {STATUS_COLUMNS.map((col) => {
            const colApps = applications.filter(a => a.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200 flex flex-col space-y-3 min-h-[450px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">{col.label}</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colApps.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 font-medium">
                      Empty
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <div
                        key={app._id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{app.title}</h4>
                            <p className="text-[11px] font-semibold text-slate-500">{app.company}</p>
                          </div>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {app.notes && (
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl line-clamp-2">
                            "{app.notes}"
                          </p>
                        )}

                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                          <span>Applied: {app.applied_date}</span>
                        </div>

                        {/* Move status select */}
                        <div className="pt-2 border-t border-slate-100">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700"
                          >
                            <option value="Applied">→ Applied</option>
                            <option value="Under Review">→ Under Review</option>
                            <option value="Interview">→ Interview</option>
                            <option value="Selected">→ Selected</option>
                            <option value="Rejected">→ Rejected</option>
                            <option value="Withdrawn">→ Withdrawn</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Track New Application</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  value={newAppForm.title}
                  onChange={(e) => setNewAppForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Frontend Developer Intern"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={newAppForm.company}
                  onChange={(e) => setNewAppForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g. Google, Microsoft, Tech Startup"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newAppForm.type}
                    onChange={(e) => setNewAppForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Full-time Job</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newAppForm.status}
                    onChange={(e) => setNewAppForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Interview Date</label>
                <textarea
                  rows={2}
                  value={newAppForm.notes}
                  onChange={(e) => setNewAppForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Round 1 coding test scheduled on Friday..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Save to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
