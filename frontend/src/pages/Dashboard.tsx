import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService, EventResultRecord, NoticeRecord } from '../services/api';
import { OFFICIAL_EVENTS } from '../data/events';
import { SectionHeader } from '../components/SectionHeader';
import { SectionDivider } from '../components/SectionDivider';
import {
  CheckCircle2,
  Calendar,
  Trophy,
  LogOut,
  BookOpen,
  Sparkles,
  Zap,
  PlusCircle,
  Loader2,
  Send,
  Clock,
  ExternalLink,
  MessageSquare,
  FileCode2,
  Megaphone,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, registeredEvents, logout, refreshUserRegistrations } = useAuth();
  const [publishedResults, setPublishedResults] = useState<EventResultRecord[]>([]);
  const [activeNotices, setActiveNotices] = useState<NoticeRecord[]>([]);

  // Quick Event Registration Modal State
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [selectedEventToRegister, setSelectedEventToRegister] = useState<string>(
    `${OFFICIAL_EVENTS[0].number} — ${OFFICIAL_EVENTS[0].title}`
  );
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const whatsappGroupUrl = 'https://chat.whatsapp.com/BsDg3RV0N2A6zpeRSfHhwT?s=qt&p=a&ilr=4';

  useEffect(() => {
    document.title = 'Participant Dashboard | HiveMind 2026';
    window.scrollTo(0, 0);

    const token = localStorage.getItem('hivemind_jwt_token');
    const storedUser = localStorage.getItem('hivemind_user');

    if (!token && !storedUser && !user) {
      navigate('/login');
      return;
    }

    loadPublishedResults();
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const res = await apiService.getNotices();
      if (res && res.notices) {
        setActiveNotices(res.notices);
      }
    } catch (err) {}
  };

  const loadPublishedResults = async () => {
    try {
      const res = await apiService.getPublishedResults();
      if (res && res.results) {
        setPublishedResults(res.results);
      }
    } catch (err) { }
  };

  const hasAllEventsPass = registeredEvents.some(
    (r) =>
      r.selectedEvent.toLowerCase().includes('all events') ||
      r.selectedEvent.toLowerCase().includes('general pass')
  );

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterError(null);
    setRegisterSuccess(null);

    const firstReg = registeredEvents[0];
    const generatedId = 'HM26-' + Math.floor(100000 + Math.random() * 900000);

    const payload: Record<string, string> = {
      name: user?.name || firstReg?.name || 'Participant',
      emailId: user?.email || firstReg?.emailId || '',
      collegeEmailId: firstReg?.collegeEmailId || user?.email || '',
      regNo: firstReg?.regNo || '24103001',
      trade: firstReg?.trade || 'CSE',
      phoneNumber: firstReg?.phoneNumber || '9876543210',
      college: firstReg?.college || 'SLIET Longowal',
      degree: firstReg?.degree || 'B.Tech',
      batchYear: firstReg?.batchYear || '2026',
      selectedEvent: selectedEventToRegister,
      submissionId: generatedId,
    };

    try {
      const res = await apiService.registerForEvent(payload);
      if (res && res.success) {
        setRegisterSuccess(`Successfully registered for ${selectedEventToRegister}!`);
        await refreshUserRegistrations();
        setTimeout(() => {
          setShowRegisterModal(false);
          setRegisterSuccess(null);
        }, 1500);
      }
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to register for event.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Participant Timeline Steps
  const participantTimeline = [
    {
      step: '01',
      title: 'REGISTRATION & COMMUNITY VERIFICATION',
      date: 'ACTIVE NOW',
      status: 'COMPLETED',
      description: 'Your registration credentials are verified in the HiveMind Portal Core. Join official SSDC WhatsApp community for real-time announcements.',
      actionText: 'JOIN WHATSAPP COMMUNITY',
      actionUrl: whatsappGroupUrl,
      isExternal: true,
      badgeColor: 'bg-cyber-cyan text-cyber-black',
    },
    {
      step: '02',
      title: 'PROBLEM STATEMENT & RULEBOOK RELEASE',
      date: 'OCTOBER 10, 2026',
      status: 'LIVE NOW',
      description: 'Review official challenge specifications, evaluation rubrics, and codebase starter templates for your registered events.',
      actionText: 'EXPLORE CHALLENGES & RULES',
      actionUrl: '/events',
      isExternal: false,
      badgeColor: 'bg-cyber-yellow text-cyber-black',
    },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <SectionHeader
            sysLabel="PARTICIPANT // DASHBOARD"
            title="MY HIVEMIND PORTAL"
            subtitle="Track your registered events, submission IDs, live event statuses, and challenge announcements."
          />

          <div className="shrink-0 flex gap-3">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 bg-cyber-charcoal border border-cyber-pink/50 text-cyber-pink font-mono text-xs clip-chamfer hover:bg-cyber-pink hover:text-cyber-black transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        {user && (
          <div className="bg-cyber-charcoal border-2 border-cyber-cyan p-6 clip-chamfer mb-10 shadow-[0_0_25px_rgba(0,207,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cyber-cyan text-cyber-black font-display font-bold text-3xl flex items-center justify-center clip-chamfer shadow-[0_0_20px_rgba(0,207,255,0.5)]">
                {user.name.charAt(0)}
              </div>
              <div>
                <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest uppercase block mb-1">
                  AUTHENTICATED PARTICIPANT
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold italic uppercase text-cyber-white leading-none">
                  {user.name}
                </h2>
                <p className="font-mono text-xs text-cyber-muted mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            <div>
              {hasAllEventsPass ? (
                <div className="px-5 py-3 bg-cyber-yellow/10 border-2 border-cyber-yellow text-cyber-yellow font-mono text-xs font-bold tracking-wider clip-chamfer flex items-center gap-2 uppercase">
                  <CheckCircle2 className="w-4 h-4 text-cyber-yellow" />
                  <span>ALL EVENTS PASS ACTIVE — FULL ACCESS UNLOCKED</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-6 py-3 bg-cyber-cyan text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all uppercase text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(0,207,255,0.4)]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ REGISTER PARTICULAR EVENT</span>
                  </button>

                  <Link
                    to="/register"
                    className="px-5 py-3 bg-cyber-black border border-cyber-cyan/50 text-cyber-white font-display font-bold italic tracking-wider clip-chamfer hover:border-cyber-cyan transition-all uppercase text-sm"
                  >
                    FULL FORM
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALL EVENTS GENERAL FESTIVAL PASS BANNER (If Opted All Events) */}
        {hasAllEventsPass && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cyber-black border-2 border-cyber-yellow p-6 clip-chamfer-lg mb-10 relative overflow-hidden shadow-[0_0_35px_rgba(255,215,0,0.25)]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-yellow/10 blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-cyber-yellow animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyber-yellow">
                ALL EVENTS GENERAL PASS UNLOCKED
              </span>
            </div>

            <h3 className="font-display text-3xl font-black italic uppercase text-cyber-white mb-2">
              VIP GENERAL FESTIVAL ACCESS ENGAGED
            </h3>

            <p className="text-cyber-muted text-xs font-body max-w-2xl mb-6">
              You are registered with the **All Events / General Festival Pass**. You have full eligible access to participate in all 10 official festival challenges:
            </p>

            {/* UNLOCKED CHALLENGES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {OFFICIAL_EVENTS.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-cyber-charcoal border border-cyber-yellow/40 p-4 clip-chamfer flex items-center justify-between group hover:border-cyber-yellow transition-all"
                >
                  <div>
                    <span className="font-mono text-[10px] text-cyber-yellow font-bold block mb-0.5">
                      {ev.number} — UNLOCKED
                    </span>
                    <h4 className="font-display text-lg font-bold italic uppercase text-cyber-white group-hover:text-cyber-yellow transition-colors">
                      {ev.title}
                    </h4>
                  </div>
                  <Zap className="w-5 h-5 text-cyber-yellow shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* LIVE ANNOUNCEMENTS & OFFICIAL NOTICES FEED */}
        {activeNotices.length > 0 && (
          <div className="mb-12">
            <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white mb-6 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-cyber-pink animate-pulse" />
              <span>OFFICIAL ANNOUNCEMENTS & LIVE NOTICES ({activeNotices.length})</span>
            </h3>

            <div className="space-y-4">
              {activeNotices.map((n) => (
                <div
                  key={n.noticeId}
                  className={`bg-cyber-charcoal border-2 ${
                    n.priority === 'URGENT'
                      ? 'border-cyber-pink shadow-[0_0_20px_rgba(255,0,127,0.3)]'
                      : n.priority === 'HIGH'
                      ? 'border-cyber-yellow shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                      : 'border-cyber-cyan/50'
                  } p-6 clip-chamfer relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 clip-chamfer uppercase ${
                        n.priority === 'URGENT' ? 'bg-cyber-pink text-cyber-white' : n.priority === 'HIGH' ? 'bg-cyber-yellow text-cyber-black' : 'bg-cyber-cyan text-cyber-black'
                      }`}>
                        {n.category}
                      </span>
                      <span className="font-mono text-xs text-cyber-muted">
                        TARGET: {n.targetEvent || 'ALL EVENTS'}
                      </span>
                    </div>

                    {n.publishedAt && (
                      <span className="font-mono text-[10px] text-cyber-muted">
                        {new Date(n.publishedAt).toLocaleDateString()} {new Date(n.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-xl font-extrabold italic uppercase text-cyber-white mb-2">
                    {n.title}
                  </h4>

                  <p className="font-body text-sm text-cyber-muted whitespace-pre-wrap leading-relaxed">
                    {n.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGISTERED EVENTS SECTION */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-cyber-cyan" />
              <span>MY REGISTERED CHALLENGES ({registeredEvents.length})</span>
            </h3>

            {!hasAllEventsPass && (
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-mono text-xs font-bold clip-chamfer hover:bg-cyber-cyan hover:text-cyber-black transition-all flex items-center gap-1.5 uppercase"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>ADD EVENT</span>
              </button>
            )}
          </div>

          {registeredEvents.length === 0 ? (
            <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-10 text-center clip-chamfer">
              <BookOpen className="w-12 h-12 text-cyber-muted mx-auto mb-4" />
              <p className="font-mono text-sm text-cyber-muted mb-4">
                No active event registrations found for your account.
              </p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-6 py-3 bg-cyber-cyan text-cyber-black font-display font-bold italic tracking-wider clip-chamfer inline-block uppercase"
              >
                REGISTER FOR EVENTS NOW
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registeredEvents.map((reg, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-cyber-charcoal border-2 border-cyber-cyan/50 p-6 clip-chamfer relative overflow-hidden group hover:border-cyber-cyan transition-all shadow-[0_0_20px_rgba(0,207,255,0.1)]"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-cyber-cyan/20 pb-3">
                    <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest bg-cyber-black px-3 py-1 border border-cyber-cyan/30 clip-chamfer">
                      ID: {reg.submissionId}
                    </span>
                    <span className="font-mono text-[10px] text-cyber-yellow bg-cyber-yellow/10 px-2.5 py-0.5 border border-cyber-yellow/40 clip-chamfer uppercase font-bold">
                      {reg.status || 'CONFIRMED'}
                    </span>
                  </div>

                  <h4 className="font-display text-2xl font-extrabold italic uppercase text-cyber-white mb-2 group-hover:text-cyber-cyan transition-colors">
                    {reg.selectedEvent}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs text-cyber-muted bg-cyber-black/60 p-3 clip-chamfer mb-4">
                    <div>
                      <span className="text-cyber-cyan block text-[10px]">PARTICIPANT</span>
                      <span>{reg.name}</span>
                    </div>
                    <div>
                      <span className="text-cyber-cyan block text-[10px]">ROLL NO</span>
                      <span>{reg.regNo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-cyber-muted font-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span>Registered: {new Date(reg.registeredAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* PARTICIPANT TIMELINE & ACTION ITEMS */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyber-cyan" />
            <span>PARTICIPANT TIMELINE & ACTION ITEMS</span>
          </h3>

          <div className="space-y-4">
            {participantTimeline.map((item, idx) => (
              <div
                key={idx}
                className="bg-cyber-charcoal border border-cyber-cyan/40 p-5 clip-chamfer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyber-cyan transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyber-black border border-cyber-cyan/60 clip-chamfer flex items-center justify-center font-mono text-sm font-bold text-cyber-cyan shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 clip-chamfer uppercase ${item.badgeColor}`}>
                        {item.status}
                      </span>
                      <span className="font-mono text-xs text-cyber-muted">
                        [{item.date}]
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold italic uppercase text-cyber-white">
                      {item.title}
                    </h4>
                    <p className="font-body text-xs text-cyber-muted max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {item.isExternal ? (
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-cyber-cyan text-cyber-black font-mono text-xs font-bold clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center gap-2 uppercase shadow-[0_0_10px_rgba(0,207,255,0.3)]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{item.actionText}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      to={item.actionUrl}
                      className="px-5 py-2.5 bg-cyber-black border border-cyber-cyan text-cyber-cyan font-mono text-xs font-bold clip-chamfer hover:bg-cyber-cyan hover:text-cyber-black transition-all flex items-center gap-2 uppercase"
                    >
                      <FileCode2 className="w-4 h-4" />
                      <span>{item.actionText}</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PUBLISHED CHALLENGE WINNERS & ANNOUNCEMENTS */}
        {publishedResults.length > 0 && (
          <div id="results-section" className="mb-12">
            <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-cyber-yellow" />
              <span>OFFICIAL CHALLENGE WINNERS & ANNOUNCEMENTS</span>
            </h3>

            <div className="space-y-6">
              {publishedResults.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-cyber-black border-2 border-cyber-yellow/60 p-6 clip-chamfer-lg relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-cyber-yellow/30 pb-3">
                    <span className="font-display text-2xl font-black italic uppercase text-cyber-white">
                      {res.eventTitle}
                    </span>
                    <span className="font-mono text-xs text-cyber-yellow font-bold uppercase bg-cyber-yellow/10 px-3 py-1 border border-cyber-yellow/40 clip-chamfer">
                      {res.eventStatus || 'RESULTS ANNOUNCED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {res.winner1st && (
                      <div className="bg-cyber-charcoal border border-cyber-yellow/50 p-4 clip-chamfer">
                        <span className="font-mono text-[10px] text-cyber-yellow font-bold block uppercase mb-1">
                          🏆 1ST PLACE WINNER
                        </span>
                        <span className="font-display text-lg font-bold text-cyber-white italic">
                          {res.winner1st}
                        </span>
                      </div>
                    )}

                    {res.winner2nd && (
                      <div className="bg-cyber-charcoal border border-cyber-cyan/40 p-4 clip-chamfer">
                        <span className="font-mono text-[10px] text-cyber-cyan font-bold block uppercase mb-1">
                          🥈 2ND PLACE WINNER
                        </span>
                        <span className="font-display text-lg font-bold text-cyber-white italic">
                          {res.winner2nd}
                        </span>
                      </div>
                    )}

                    {res.winner3rd && (
                      <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-4 clip-chamfer">
                        <span className="font-mono text-[10px] text-cyber-muted font-bold block uppercase mb-1">
                          🥉 3RD PLACE WINNER
                        </span>
                        <span className="font-display text-lg font-bold text-cyber-white italic">
                          {res.winner3rd}
                        </span>
                      </div>
                    )}
                  </div>

                  {res.announcementNotes && (
                    <div className="p-3 bg-cyber-charcoal/80 border border-cyber-cyan/20 clip-chamfer font-mono text-xs text-cyber-muted">
                      <span className="text-cyber-cyan font-bold block mb-1">ORGANIZER NOTES:</span>
                      <p>{res.announcementNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK REGISTER MODAL */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-cyber-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cyber-charcoal border-2 border-cyber-cyan p-6 sm:p-8 clip-chamfer-lg max-w-lg w-full relative shadow-[0_0_50px_rgba(0,207,255,0.3)]"
            >
              <div className="flex items-center justify-between mb-6 border-b border-cyber-cyan/40 pb-4">
                <div className="flex items-center gap-2 text-cyber-cyan font-display text-xl font-black italic uppercase">
                  <PlusCircle className="w-6 h-6" />
                  <span>REGISTER FOR PARTICULAR EVENT</span>
                </div>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="text-cyber-muted hover:text-cyber-white font-mono text-sm font-bold"
                >
                  ✕ CLOSE
                </button>
              </div>

              {registerSuccess && (
                <div className="p-4 bg-cyber-cyan/10 border-2 border-cyber-cyan clip-chamfer text-cyber-cyan text-xs font-mono mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{registerSuccess}</span>
                </div>
              )}

              {registerError && (
                <div className="p-4 bg-cyber-pink/10 border-2 border-cyber-pink clip-chamfer text-cyber-pink text-xs font-mono mb-6">
                  <span>{registerError}</span>
                </div>
              )}

              <form onSubmit={handleQuickRegister} className="space-y-6">
                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2">
                    SELECT EVENT TO REGISTER
                  </label>
                  <select
                    value={selectedEventToRegister}
                    onChange={(e) => setSelectedEventToRegister(e.target.value)}
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-cyan focus:outline-none"
                  >
                    <option value="All Events / General Pass">ALL EVENTS / GENERAL FESTIVAL PASS</option>
                    {OFFICIAL_EVENTS.map((ev) => (
                      <option key={ev.id} value={`${ev.number} — ${ev.title}`}>
                        {ev.number} — {ev.title} ({ev.tagline})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-cyber-black/70 border border-cyber-cyan/20 clip-chamfer font-mono text-xs text-cyber-muted space-y-1">
                  <div><span className="text-cyber-cyan font-bold">NAME:</span> {user?.name}</div>
                  <div><span className="text-cyber-cyan font-bold">EMAIL:</span> {user?.email}</div>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-4 bg-cyber-cyan text-cyber-black font-display font-black text-lg italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(0,207,255,0.5)] disabled:opacity-50"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>SAVING TO SECURE CLOUD VAULT...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>[ CONFIRM & REGISTER EVENT ]</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        <SectionDivider label="END OF PARTICIPANT PORTAL" />
      </div>
    </div>
  );
};
