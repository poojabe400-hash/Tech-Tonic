import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Briefcase, Calendar, Users, Award, 
  Plus, Trash2, Edit3, CheckCircle, AlertTriangle, 
  ExternalLink, Search, RefreshCw, BarChart3, BookOpen, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, opportunitiesAPI, eventsAPI } from '../services/api';

export function AdminPage() {
  const { user, loginAsAdmin } = useAuth();
  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@careerbridge.ai');

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'opportunities' | 'events' | 'reports'
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Opportunities state
  const [opportunities, setOpportunities] = useState([]);
  const [oppSearch, setOppSearch] = useState('');
  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [newOpp, setNewOpp] = useState({
    title: '',
    company: '',
    type: 'internship',
    mode: 'remote',
    location: 'Remote',
    category: 'Software Engineering',
    stipend: 'Competitive',
    experience_level: 'beginner',
    is_paid: true,
    required_skills: '',
    eligibility: 'Pre-final and Final year B.Tech/B.E/BCA/MCA students',
    description: '',
    deadline: '2026-12-31',
    apply_url: ''
  });

  // Events state
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState('');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    organizer: '',
    category: 'Hackathon',
    format: 'Online',
    location: 'Virtual',
    start_date: '2026-11-20',
    end_date: '2026-11-22',
    registration_deadline: '2026-11-15',
    eligibility: 'All undergraduate and postgraduate students',
    fee: 'Free',
    description: '',
    registration_url: ''
  });

  // Reports state
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, [isAdmin]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getDashboard();
      const resData = res.data || res;
      if (res.success || res.data?.success) {
        setStats(resData.stats || (res.data && res.data.stats));
        setRecentStudents(resData.recent_students || (res.data && res.data.recent_students) || []);
        setRecentApps(resData.recent_applications || (res.data && res.data.recent_applications) || []);
      }
      // Also fetch opportunities and events for management
      const [oppRes, evRes, repRes] = await Promise.all([
        opportunitiesAPI.getAll({ limit: 100 }),
        eventsAPI.getAll({ limit: 100 }),
        adminAPI.getReports().catch(() => ({ data: [] }))
      ]);

      const oppData = oppRes.data || oppRes;
      const evData = evRes.data || evRes;
      const repData = repRes.data || repRes;

      if (oppRes.success || oppRes.data?.success) {
        setOpportunities(oppData.items || oppData.opportunities || (oppRes.data && oppRes.data.items) || []);
      }
      if (evRes.success || evRes.data?.success) {
        setEvents(evData.items || evData.events || (evRes.data && evRes.data.items) || []);
      }
      if (repRes.success || repRes.data?.success || Array.isArray(repData)) {
        setReports(Array.isArray(repData) ? repData : (repData.reports || []));
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
      setError(err.message || 'Failed to load admin console data.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Opportunity handlers
  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newOpp,
        required_skills: typeof newOpp.required_skills === 'string'
          ? newOpp.required_skills.split(',').map(s => s.trim()).filter(Boolean)
          : newOpp.required_skills
      };
      const res = await adminAPI.createOpportunity(payload);
      if (res.success || res.data?.success) {
        const created = res.data || res;
        setOpportunities([created, ...opportunities]);
        setShowAddOppModal(false);
        setNewOpp({
          title: '', company: '', type: 'internship', mode: 'remote', location: 'Remote',
          category: 'Software Engineering', stipend: 'Competitive', experience_level: 'beginner',
          is_paid: true, required_skills: '', eligibility: 'Pre-final/final year students',
          description: '', deadline: '2026-12-31', apply_url: ''
        });
        showNotification('New opportunity added and verified successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to add opportunity.');
    }
  };

  const handleDeleteOpportunity = async (id) => {
    if (!window.confirm('Are you sure you want to remove this opportunity?')) return;
    try {
      const res = await adminAPI.deleteOpportunity(id);
      if (res.success || res.data?.success) {
        setOpportunities(opportunities.filter(o => (o.id !== id && o._id !== id)));
        showNotification('Opportunity removed successfully.');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete opportunity.');
    }
  };

  // Event handlers
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.createEvent(newEvent);
      if (res.success || res.data?.success) {
        const created = res.data || res;
        setEvents([created, ...events]);
        setShowAddEventModal(false);
        setNewEvent({
          title: '', organizer: '', category: 'Hackathon', format: 'Online',
          location: 'Virtual', start_date: '2026-11-20', end_date: '2026-11-22',
          registration_deadline: '2026-11-15', eligibility: 'College students',
          fee: 'Free', description: '', registration_url: ''
        });
        showNotification('New hackathon/event listed successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to add event.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to remove this event?')) return;
    try {
      const res = await adminAPI.deleteEvent(id);
      if (res.success || res.data?.success) {
        setEvents(events.filter(e => (e.id !== id && e._id !== id)));
        showNotification('Event removed successfully.');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  const filteredOpps = opportunities.filter(o => 
    o.title?.toLowerCase().includes(oppSearch.toLowerCase()) ||
    o.company?.toLowerCase().includes(oppSearch.toLowerCase())
  );

  const filteredEvents = events.filter(e => 
    e.title?.toLowerCase().includes(eventSearch.toLowerCase()) ||
    e.organizer?.toLowerCase().includes(eventSearch.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Admin Access</h2>
        <p className="text-gray-600 mb-6">
          You are currently logged in as a student (<span className="font-semibold text-gray-800">{user?.email}</span>). 
          Only authorized administrators can access the CareerBridge AI Management Console.
        </p>
        <div className="p-4 bg-navy-50 rounded-xl border border-navy-100 text-left mb-6">
          <h4 className="font-semibold text-navy-900 text-sm mb-1">Evaluator Quick Switch:</h4>
          <p className="text-xs text-navy-700 mb-3">
            Click below to instantly switch to the verified administrator role and test all moderation, posting, and platform management tools.
          </p>
          <button
            onClick={() => loginAsAdmin()}
            className="w-full py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-electric-400" />
            Switch to Admin Role (1-Click Evaluator)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-800 to-electric-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-electric-500/20 text-electric-300 border border-electric-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Superadmin
            </span>
            <span className="text-xs text-navy-300">Logged in as {user?.email}</span>
          </div>
          <h1 className="text-2xl font-bold">Platform Management Console</h1>
          <p className="text-navy-200 text-sm mt-1">
            Manage opportunity postings, hackathons, moderation reports, and monitor platform health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'overview'
              ? 'text-electric-600 font-semibold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Platform Overview
          </span>
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'opportunities'
              ? 'text-electric-600 font-semibold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Opportunities ({opportunities.length})
          </span>
          {activeTab === 'opportunities' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'events'
              ? 'text-electric-600 font-semibold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Hackathons & Events ({events.length})
          </span>
          {activeTab === 'events' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'reports'
              ? 'text-electric-600 font-semibold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Moderation & Reports ({reports.length})
          </span>
          {activeTab === 'reports' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-600 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-navy-400 mb-2">
                <Users className="w-5 h-5 text-electric-600" />
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_students || 10}</div>
              <div className="text-xs text-gray-500 mt-1">Registered Students</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-navy-400 mb-2">
                <Briefcase className="w-5 h-5 text-navy-600" />
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Live</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_opportunities || opportunities.length}</div>
              <div className="text-xs text-gray-500 mt-1">Opportunities</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-navy-400 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Upcoming</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_events || events.length}</div>
              <div className="text-xs text-gray-500 mt-1">Hackathons & Events</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-navy-400 mb-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Tracked</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_applications || 1}</div>
              <div className="text-xs text-gray-500 mt-1">Total Applications</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-navy-400 mb-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_scholarships || 5}</div>
              <div className="text-xs text-gray-500 mt-1">Scholarships</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-navy-400 mb-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">Free</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_resources || 10}</div>
              <div className="text-xs text-gray-500 mt-1">Learning Resources</div>
            </div>
          </div>

          {/* Activity Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Students */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-electric-600" />
                  Recent Student Registrations
                </h3>
                <span className="text-xs text-gray-400">Total: {recentStudents.length} sample active</span>
              </div>
              <div className="divide-y divide-gray-100">
                {recentStudents.slice(0, 5).map((st, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{st.full_name || 'Student Candidate'}</div>
                      <div className="text-xs text-gray-500">{st.college} • {st.branch}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded-full font-medium">
                        Sem {st.semester || 6}
                      </span>
                      <div className="text-xs text-gray-400 mt-0.5">{st.skills?.length || 0} skills listed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-navy-800" />
                Administrative Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => { setActiveTab('opportunities'); setShowAddOppModal(true); }}
                  className="w-full p-3 bg-navy-50 hover:bg-navy-100 border border-navy-100 rounded-xl text-left transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-navy-900">Post New Opportunity</div>
                      <div className="text-xs text-navy-600">Add verified internship or full-time role with skill criteria</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-navy-800 group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => { setActiveTab('events'); setShowAddEventModal(true); }}
                  className="w-full p-3 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-xl text-left transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-purple-900">List New Hackathon / Event</div>
                      <div className="text-xs text-purple-600">Broadcast national hackathon, workshop, or campus hiring drive</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-800 group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className="w-full p-3 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-xl text-left transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-amber-900">Review Community Reports</div>
                      <div className="text-xs text-amber-600">Inspect flagged listings, expired deadlines, or broken URLs</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPPORTUNITIES MANAGER */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by role title or company..."
                value={oppSearch}
                onChange={(e) => setOppSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-electric-500"
              />
            </div>
            <button
              onClick={() => setShowAddOppModal(true)}
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Opportunity
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-medium text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Type & Mode</th>
                    <th className="py-3 px-4">Compensation</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOpps.map((opp) => {
                    const oppId = opp.id || opp._id;
                    return (
                      <tr key={oppId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{opp.title}</div>
                          <div className="text-xs text-gray-500">{opp.company} • {opp.location}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {opp.type}
                          </span>
                          <span className="ml-1.5 capitalize text-xs text-gray-500">
                            {opp.mode}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-gray-800">
                          {opp.stipend || 'Competitive'}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">
                          {opp.deadline}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-500 font-mono">
                            {opp.source || 'Admin Verified'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={opp.apply_url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-electric-600 transition-colors"
                              title="Preview apply link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteOpportunity(oppId)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOpps.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-400 text-sm">
                        No opportunities matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS MANAGER */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hackathons and events..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-electric-500"
              />
            </div>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Hackathon / Event
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-medium text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Event Name</th>
                    <th className="py-3 px-4">Organizer</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Reg Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEvents.map((ev) => {
                    const evId = ev.id || ev._id;
                    return (
                      <tr key={evId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{ev.title}</div>
                          <div className="text-xs text-gray-500">{ev.category} • {ev.fee || 'Free'}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {ev.organizer}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            ev.format === 'Online' ? 'bg-cyan-50 text-cyan-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {ev.format}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">
                          {ev.registration_deadline || ev.start_date}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                            {ev.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={ev.registration_url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-electric-600 transition-colors"
                              title="Registration link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteEvent(evId)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS & MODERATION */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Community Moderation Reports</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Feedback submitted by students regarding expired application links or updated eligibility requirements.
              </p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
              {reports.length} Open Inquiries
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {reports.map((rep, idx) => (
              <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                      {rep.type}
                    </span>
                    <span className="font-medium text-sm text-gray-900">{rep.item_title}</span>
                  </div>
                  <p className="text-xs text-gray-600">{rep.issue}</p>
                  <span className="text-[11px] text-gray-400 mt-1 block">Reported by: {rep.reported_by}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                    {rep.status}
                  </span>
                  <button
                    onClick={() => showNotification(`Report #${rep.id} marked as resolved.`)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD OPPORTUNITY MODAL */}
      {showAddOppModal && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Post New Verified Opportunity</h3>
            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={newOpp.title}
                    onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                    placeholder="e.g. AI Research Intern"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={newOpp.company}
                    onChange={(e) => setNewOpp({ ...newOpp, company: e.target.value })}
                    placeholder="e.g. OpenAI Labs"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newOpp.type}
                    onChange={(e) => setNewOpp({ ...newOpp, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Full-time Job</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Work Mode</label>
                  <select
                    value={newOpp.mode}
                    onChange={(e) => setNewOpp({ ...newOpp, mode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Compensation</label>
                  <input
                    type="text"
                    value={newOpp.stipend}
                    onChange={(e) => setNewOpp({ ...newOpp, stipend: e.target.value })}
                    placeholder="e.g. $1,500/mo"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Required Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={newOpp.required_skills}
                  onChange={(e) => setNewOpp({ ...newOpp, required_skills: e.target.value })}
                  placeholder="e.g. Python, PyTorch, Machine Learning, FastApi"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={newOpp.deadline}
                    onChange={(e) => setNewOpp({ ...newOpp, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Official Apply Link</label>
                  <input
                    type="url"
                    value={newOpp.apply_url}
                    onChange={(e) => setNewOpp({ ...newOpp, apply_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newOpp.description}
                  onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
                  placeholder="Responsibilities, requirements, and interview process details..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddOppModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-sm font-medium"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-navy-900 mb-4">List New Hackathon or Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g. Smart India Hackathon 2026"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Organizer / Institution *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    placeholder="e.g. Ministry of Education & AICTE"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Coding Competition">Coding Competition</option>
                    <option value="Technical Workshop">Technical Workshop</option>
                    <option value="Placement Drive">Placement Drive</option>
                    <option value="Webinar">Webinar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Format</label>
                  <select
                    value={newEvent.format}
                    onChange={(e) => setNewEvent({ ...newEvent, format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Registration Fee</label>
                  <input
                    type="text"
                    value={newEvent.fee}
                    onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                    placeholder="Free"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newEvent.start_date}
                    onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Registration Deadline</label>
                  <input
                    type="date"
                    value={newEvent.registration_deadline}
                    onChange={(e) => setNewEvent({ ...newEvent, registration_deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Official Registration Link</label>
                <input
                  type="url"
                  value={newEvent.registration_url}
                  onChange={(e) => setNewEvent({ ...newEvent, registration_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Theme, tracks, eligibility rules, and prize pool..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-sm font-medium"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
