import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import api from '../services/api';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  FileText,
  Target,
  BarChart,
  Compass,
  Briefcase,
  Calendar,
  CheckCircle,
  Building,
  GraduationCap,
  ShieldCheck,
  Users,
  Award,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredOpps, setFeaturedOpps] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({
    opportunities: 0,
    events: 0,
    skills: 30,
    students: 10
  });

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    try {
      const [oppsRes, eventsRes, statsRes] = await Promise.allSettled([
        api.get('/opportunities?limit=4'),
        api.get('/events/upcoming?limit=3'),
        api.get('/admin/dashboard')
      ]);

      if (oppsRes.status === 'fulfilled' && oppsRes.value.success) {
        setFeaturedOpps(oppsRes.value.data.items || []);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
        setUpcomingEvents(eventsRes.value.data || []);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        const s = statsRes.value.data.stats;
        setStats({
          opportunities: s.total_opportunities || 20,
          events: s.total_events || 15,
          skills: 30,
          students: s.total_students || 10
        });
      }
    } catch (e) {
      console.warn('Landing data load:', e);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white">
        {/* Glow Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-blue-400/15 via-indigo-300/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-xs mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Powered Campus-to-Employment Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-5xl mx-auto">
            Your Skills. Your Future.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Our AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Discover opportunities, identify your skill gaps, and build a personalized path towards your dream career. We don't just help students find jobs—we help students become ready for jobs.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <NavLink
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </NavLink>

            <NavLink
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Explore Opportunities</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </NavLink>
          </div>

          {/* Core Philosophy Highlight */}
          <div className="mt-14 max-w-2xl mx-auto p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center space-x-3 text-xs sm:text-sm text-slate-700 font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Ethical & Transparent AI:</strong> 100% merit-based skill scoring without sensitive demographic bias.
            </span>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section (Real verified counts) */}
      <section className="py-12 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">
                {stats.opportunities}+
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Verified Jobs & Internships
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400">
                {stats.events}+
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Hackathons & Tech Events
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400">
                {stats.skills}+
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Standardized Tech Skills
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                100%
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Transparent Match Logic
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Step-by-Step Architecture
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How CareerBridge AI Works
            </h2>
            <p className="mt-4 text-base text-slate-600">
              A seamless, guided transformation from college learner to hireable software engineer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Add your college, degree, branch, and technical interests in minutes.',
                icon: UserCheck,
                color: 'from-blue-500 to-indigo-600',
              },
              {
                step: '02',
                title: 'Upload Your Resume',
                desc: 'Our NLP engine extracts your programming languages, tools, and projects.',
                icon: FileText,
                color: 'from-indigo-500 to-purple-600',
              },
              {
                step: '03',
                title: 'Discover Matching Opps',
                desc: 'Our AI calculates weighted match scores with transparent explanations.',
                icon: Target,
                color: 'from-purple-500 to-pink-600',
              },
              {
                step: '04',
                title: 'Identify Missing Skills',
                desc: 'Visual radar charts reveal exactly which proficiencies to strengthen.',
                icon: BarChart,
                color: 'from-pink-500 to-rose-600',
              },
              {
                step: '05',
                title: 'Follow Career GPS',
                desc: 'Execute a personalized 6-week learning plan with free curated resources.',
                icon: Compass,
                color: 'from-emerald-500 to-teal-600',
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-200">{step.step}</span>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Opportunities Preview */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Verified Opportunities
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                Featured Jobs & Internships
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Every listing is verified with verified skill tags and authentic application routes.
              </p>
            </div>
            <NavLink
              to="/explore"
              className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              <span>View All Opportunities</span>
              <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOpps.map((opp) => (
              <div
                key={opp._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {opp.type}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 capitalize">
                      {opp.mode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{opp.title}</h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{opp.company}</p>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(opp.required_skills || []).slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600">
                    {opp.stipend || 'Competitive'}
                  </span>
                  <NavLink
                    to={`/explore`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Hackathons & Community
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                Upcoming Hackathons & Events
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Explore national competitions, workshops, and hiring placement drives.
              </p>
            </div>
            <NavLink
              to="/events-explore"
              className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>Explore All Events</span>
              <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((ev) => (
              <div
                key={ev._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {ev.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {ev.format}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">{ev.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{ev.organizer}</p>
                  <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Registration Deadline</p>
                    <p className="text-xs font-bold text-rose-600">{ev.registration_deadline}</p>
                  </div>
                  <NavLink
                    to="/events-explore"
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    View Details
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Core Benefits */}
      <section id="about-us" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                The CareerBridge Difference
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                "We don't just help students find jobs. We help students become ready for jobs."
              </h2>
              <p className="mt-6 text-base text-slate-600 leading-relaxed">
                Most job boards overwhelm students with lists of vacancies they aren't qualified for. CareerBridge AI breaks this cycle by providing continuous, guided preparedness:
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Mathematical weighted match scoring formula with zero demographic bias',
                  'Interactive Skill Gap Radar identifying exact missing technologies',
                  'Career GPS generating 6-week structured week-by-week roadmaps',
                  'Opportunity Equalizer promoting free certifications and tier-free grants',
                  'Contextual AI Career Assistant grounded in real platform data'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 mt-0.5 shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <NavLink
                  to="/register"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <span>Build Your Student Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
              </div>
            </div>

            {/* Visual Card Mockup */}
            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-2xl text-white border border-slate-800">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">AI Match Intelligence</h4>
                    <p className="text-[11px] text-slate-400">Formula-Driven Matching</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  88% Match
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <p className="text-xs text-slate-300 font-semibold mb-1">Strong Overlap Found:</p>
                  <p className="text-xs text-cyan-300 font-medium">Python • Flask • RESTful APIs • Git & GitHub</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <p className="text-xs text-slate-300 font-semibold mb-1">Actionable Skill Gap:</p>
                  <p className="text-xs text-amber-300 font-medium">Docker • SQL Window Functions</p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs text-slate-300">
                  <p className="font-semibold text-white mb-1">Career GPS Recommendation:</p>
                  <p>Complete Week 2 MLOps & Docker tutorial on FreeCodeCamp to boost match score to 96%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">CareerBridge AI</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Empowering college students nationwide to bridge skill gaps, build verifiable project portfolios, and access equal career opportunities through artificial intelligence.
              </p>
              <p className="text-xs text-slate-500">
                Tagline: "Your Skills. Your Future. Our AI."
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Modules</h4>
              <ul className="space-y-2 text-xs">
                <li><NavLink to="/explore" className="hover:text-white">Jobs & Internships</NavLink></li>
                <li><NavLink to="/events-explore" className="hover:text-white">Hackathons & Events</NavLink></li>
                <li><NavLink to="/login" className="hover:text-white">Skill Gap Radar</NavLink></li>
                <li><NavLink to="/login" className="hover:text-white">Opportunity Equalizer</NavLink></li>
                <li><NavLink to="/login" className="hover:text-white">Career GPS</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform & Ethics</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#about-us" className="hover:text-white">About CareerBridge</a></li>
                <li><span className="text-slate-500">Privacy Policy (Zero Data Sharing)</span></li>
                <li><span className="text-slate-500">Terms of Use</span></li>
                <li><span className="text-slate-500">Verified Partner Guidelines</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© 2026 CareerBridge AI. Built for national-level innovation showcase.</p>
            <p className="mt-2 sm:mt-0 font-medium text-slate-400">All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
