import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiService, RegistrationRecord, NoticeRecord } from '../services/api';
import { OFFICIAL_EVENTS } from '../data/events';
import { SectionHeader } from '../components/SectionHeader';
import { SectionDivider } from '../components/SectionDivider';
import {
  Download,
  Filter,
  Search,
  Trophy,
  CheckCircle2,
  LogOut,
  Loader2,
  Send,
  Database,
  Megaphone,
  Trash2,
} from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Results Publishing Form State
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [publishEventId, setPublishEventId] = useState<string>(OFFICIAL_EVENTS[0].id);
  const [winner1st, setWinner1st] = useState<string>('');
  const [winner2nd, setWinner2nd] = useState<string>('');
  const [winner3rd, setWinner3rd] = useState<string>('');
  const [announcementNotes, setAnnouncementNotes] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Notice Publishing Form State
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [noticeTitle, setNoticeTitle] = useState<string>('');
  const [noticeCategory, setNoticeCategory] = useState<string>('GENERAL NOTICE');
  const [noticeTargetEvent, setNoticeTargetEvent] = useState<string>('ALL EVENTS');
  const [noticeContent, setNoticeContent] = useState<string>('');
  const [noticePriority, setNoticePriority] = useState<string>('NORMAL');
  const [isPublishingNotice, setIsPublishingNotice] = useState<boolean>(false);
  const [noticeSuccess, setNoticeSuccess] = useState<string | null>(null);
  const [activeNotices, setActiveNotices] = useState<NoticeRecord[]>([]);

  useEffect(() => {
    document.title = 'SSDC Admin Portal | HiveMind 2026';
    window.scrollTo(0, 0);

    // Auth Guard
    const token = localStorage.getItem('hivemind_jwt_token');
    const storedUser = localStorage.getItem('hivemind_user');
    let isAdmin = false;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'admin') isAdmin = true;
      } catch (e) {}
    }

    if (!token || !isAdmin) {
      navigate('/login?tab=admin');
      return;
    }

    loadRegistrations();
    loadNotices();
  }, [selectedEventFilter, searchQuery]);

  const loadNotices = async () => {
    try {
      const res = await apiService.getNotices();
      if (res && res.notices) {
        setActiveNotices(res.notices);
      }
    } catch (err) {}
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingNotice(true);
    setNoticeSuccess(null);

    try {
      const res = await apiService.publishNotice({
        title: noticeTitle,
        category: noticeCategory,
        targetEvent: noticeTargetEvent,
        content: noticeContent,
        priority: noticePriority,
      });

      if (res && res.success) {
        setNoticeSuccess('Notice published live to MongoDB Atlas!');
        setNoticeTitle('');
        setNoticeContent('');
        await loadNotices();
        setTimeout(() => {
          setShowNoticeModal(false);
          setNoticeSuccess(null);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error publishing notice:', err);
    } finally {
      setIsPublishingNotice(false);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      await apiService.deleteNotice(noticeId);
      await loadNotices();
    } catch (err) {}
  };

  const loadRegistrations = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getAdminRegistrations(selectedEventFilter, searchQuery);
      if (res && res.registrations) {
        setRegistrations(res.registrations);
      }
    } catch (err) {
      console.error('Failed to load admin registrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvExport = () => {
    const exportUrl = apiService.getAdminCsvExportUrl(selectedEventFilter);
    window.open(exportUrl, '_blank');
  };

  const handleExcelExport = () => {
    const exportUrl = apiService.getAdminExcelExportUrl(selectedEventFilter);
    window.open(exportUrl, '_blank');
  };

  const handlePublishResults = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setPublishSuccess(null);

    const eventObj = OFFICIAL_EVENTS.find((ev) => ev.id === publishEventId);

    try {
      const res = await apiService.publishEventResults({
        eventId: publishEventId,
        eventTitle: eventObj ? `${eventObj.number} — ${eventObj.title}` : publishEventId,
        winner1st,
        winner2nd,
        winner3rd,
        specialMentions: '',
        announcementNotes,
        eventStatus: 'RESULTS ANNOUNCED',
      });

      if (res && res.success) {
        setPublishSuccess(`Results for ${eventObj?.title || publishEventId} published to MongoDB Atlas!`);
        setTimeout(() => {
          setShowResultModal(false);
          setPublishSuccess(null);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error publishing results:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <SectionHeader
            sysLabel="ORGANIZER // ADMIN_PORTAL"
            title="SSDC ADMIN CONTROL CENTER"
            subtitle="Manage registrations stored in MongoDB Atlas, filter entries, download CSV exports, and publish event winners."
          />

          <div className="shrink-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-5 py-2.5 bg-cyber-pink text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-pink/90 transition-all flex items-center gap-2 text-sm uppercase shadow-[0_0_15px_rgba(255,0,127,0.4)]"
            >
              <Megaphone className="w-4 h-4" />
              <span>+ POST NOTICE / NEWS</span>
            </button>

            <button
              onClick={() => setShowResultModal(true)}
              className="px-5 py-2.5 bg-cyber-yellow text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-yellow/90 transition-all flex items-center gap-2 text-sm uppercase shadow-[0_0_15px_rgba(255,215,0,0.4)]"
            >
              <Trophy className="w-4 h-4" />
              <span>PUBLISH EVENT RESULTS</span>
            </button>

            <button
              onClick={handleExcelExport}
              className="px-5 py-2.5 bg-cyber-yellow text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-yellow/90 transition-all flex items-center gap-2 text-sm uppercase shadow-[0_0_15px_rgba(255,215,0,0.4)]"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT EXCEL (.XLSX)</span>
            </button>

            <button
              onClick={handleCsvExport}
              className="px-5 py-2.5 bg-cyber-cyan text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center gap-2 text-sm uppercase shadow-[0_0_15px_rgba(0,207,255,0.4)]"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT CSV (.CSV)</span>
            </button>

            <button
              onClick={() => { localStorage.removeItem('hivemind_jwt_token'); navigate('/login'); }}
              className="px-4 py-2 bg-cyber-charcoal border border-cyber-pink/50 text-cyber-pink font-mono text-xs clip-chamfer hover:bg-cyber-pink hover:text-cyber-black transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: EVENT FILTER + SEARCH */}
        <div className="bg-cyber-charcoal border-2 border-cyber-cyan/50 p-6 clip-chamfer mb-8 shadow-[0_0_25px_rgba(0,207,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Event Filter Dropdown */}
          <div className="w-full md:w-1/2 flex items-center gap-3">
            <Filter className="w-5 h-5 text-cyber-cyan shrink-0" />
            <label className="font-mono text-xs font-bold text-cyber-cyan uppercase shrink-0">
              EVENT FILTER:
            </label>
            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-cyan focus:outline-none"
            >
              <option value="ALL">ALL EVENTS / ALL REGISTRATIONS ({registrations.length})</option>
              <option value="General Pass">ALL EVENTS / GENERAL FESTIVAL PASS</option>
              {OFFICIAL_EVENTS.map((ev) => (
                <option key={ev.id} value={ev.title}>
                  {ev.number} — {ev.title}
                </option>
              ))}
            </select>
          </div>

          {/* Live Search */}
          <div className="w-full md:w-1/2 flex items-center gap-3">
            <Search className="w-5 h-5 text-cyber-cyan shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, Roll No, or ID..."
              className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-cyan focus:outline-none placeholder:text-cyber-muted/40"
            />
          </div>

        </div>

        {/* REGISTRATION DATA TABLE */}
        <div className="bg-cyber-charcoal border-2 border-cyber-cyan/40 clip-chamfer-lg relative overflow-hidden mb-12 shadow-[0_0_30px_rgba(0,207,255,0.1)]">
          <div className="p-4 bg-cyber-black border-b border-cyber-cyan/30 flex items-center justify-between font-mono text-xs text-cyber-cyan font-bold">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>MONGODB ATLAS RECORD REGISTRY</span>
            </span>
            <span>TOTAL ROWS: {registrations.length}</span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-cyber-cyan flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-mono text-xs font-bold uppercase">QUERYING MONGODB DATABASE...</span>
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-16 text-center text-cyber-muted font-mono text-xs">
              No participant registration records found matching the filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-cyber-black/80 text-cyber-cyan border-b border-cyber-cyan/30 uppercase tracking-wider">
                    <th className="p-3.5">SUBMISSION ID</th>
                    <th className="p-3.5">FULL NAME</th>
                    <th className="p-3.5">EMAIL ID</th>
                    <th className="p-3.5">ROLL NO</th>
                    <th className="p-3.5">PHONE</th>
                    <th className="p-3.5">TRADE / BRANCH</th>
                    <th className="p-3.5">SELECTED EVENT</th>
                    <th className="p-3.5">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-cyan/10">
                  {registrations.map((row, idx) => (
                    <tr key={idx} className="hover:bg-cyber-black/40 transition-colors">
                      <td className="p-3.5 font-bold text-cyber-cyan">{row.submissionId}</td>
                      <td className="p-3.5 text-cyber-white font-bold">{row.name}</td>
                      <td className="p-3.5 text-cyber-muted">{row.emailId}</td>
                      <td className="p-3.5 text-cyber-white">{row.regNo}</td>
                      <td className="p-3.5 text-cyber-muted">{row.phoneNumber}</td>
                      <td className="p-3.5 text-cyber-white">{row.trade}</td>
                      <td className="p-3.5 font-bold text-cyber-yellow">{row.selectedEvent}</td>
                      <td className="p-3.5 text-cyber-muted">{new Date(row.registeredAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PUBLISH RESULTS MODAL */}
        {showResultModal && (
          <div className="fixed inset-0 bg-cyber-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cyber-charcoal border-2 border-cyber-yellow p-6 sm:p-8 clip-chamfer-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(255,215,0,0.3)]"
            >
              <div className="flex items-center justify-between mb-6 border-b border-cyber-yellow/40 pb-4">
                <div className="flex items-center gap-2 text-cyber-yellow font-display text-2xl font-black italic uppercase">
                  <Trophy className="w-7 h-7" />
                  <span>PUBLISH CHALLENGE WINNERS</span>
                </div>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="text-cyber-muted hover:text-cyber-white font-mono text-sm font-bold"
                >
                  ✕ CLOSE
                </button>
              </div>

              {publishSuccess && (
                <div className="p-4 bg-cyber-yellow/10 border-2 border-cyber-yellow clip-chamfer text-cyber-yellow text-xs font-mono mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{publishSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePublishResults} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-yellow uppercase mb-1">
                    SELECT EVENT TO PUBLISH RESULTS
                  </label>
                  <select
                    value={publishEventId}
                    onChange={(e) => setPublishEventId(e.target.value)}
                    className="w-full bg-cyber-black border border-cyber-yellow/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-yellow focus:outline-none"
                  >
                    {OFFICIAL_EVENTS.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.number} — {ev.title} ({ev.tagline})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-white uppercase mb-1">
                    🏆 1ST PLACE WINNER NAME & DETAILS
                  </label>
                  <input
                    type="text"
                    value={winner1st}
                    onChange={(e) => setWinner1st(e.target.value)}
                    placeholder="e.g. Rahul Sharma (SLIET Longowal - CSE)"
                    required
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-yellow focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold text-cyber-white uppercase mb-1">
                      🥈 2ND PLACE WINNER
                    </label>
                    <input
                      type="text"
                      value={winner2nd}
                      onChange={(e) => setWinner2nd(e.target.value)}
                      placeholder="e.g. Priya Singh (ECE)"
                      className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-cyber-white uppercase mb-1">
                      🥉 3RD PLACE WINNER
                    </label>
                    <input
                      type="text"
                      value={winner3rd}
                      onChange={(e) => setWinner3rd(e.target.value)}
                      placeholder="e.g. Amit Kumar (ME)"
                      className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-white uppercase mb-1">
                    ANNOUNCEMENT NOTES & JUDGE FEEDBACK
                  </label>
                  <textarea
                    value={announcementNotes}
                    onChange={(e) => setAnnouncementNotes(e.target.value)}
                    placeholder="Enter special notes for participants..."
                    rows={3}
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-4 bg-cyber-yellow text-cyber-black font-display font-black text-xl italic tracking-wider clip-chamfer hover:bg-cyber-yellow/90 transition-all flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>PUBLISHING TO MONGODB ATLAS...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>[ CONFIRM & PUBLISH RESULTS LIVE ]</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* POST NOTICE MODAL */}
        {showNoticeModal && (
          <div className="fixed inset-0 bg-cyber-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cyber-charcoal border-2 border-cyber-pink p-6 sm:p-8 clip-chamfer-lg max-w-xl w-full relative shadow-[0_0_50px_rgba(255,0,127,0.3)]"
            >
              <div className="flex items-center justify-between mb-6 border-b border-cyber-pink/40 pb-4">
                <div className="flex items-center gap-2 text-cyber-pink font-display text-xl font-black italic uppercase">
                  <Megaphone className="w-6 h-6" />
                  <span>POST OFFICIAL NOTICE / NEWS</span>
                </div>
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="text-cyber-muted hover:text-cyber-white font-mono text-sm font-bold"
                >
                  ✕ CLOSE
                </button>
              </div>

              {noticeSuccess && (
                <div className="p-4 bg-cyber-pink/10 border-2 border-cyber-pink clip-chamfer text-cyber-pink text-xs font-mono mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{noticeSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePublishNotice} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-pink uppercase mb-1">
                    NOTICE / ANNOUNCEMENT TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="e.g. OFFICIAL NOTICE: PROBLEM STATEMENTS & VENUE RELEASED"
                    className="w-full bg-cyber-black border border-cyber-pink/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-pink focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold text-cyber-pink uppercase mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={noticeCategory}
                      onChange={(e) => setNoticeCategory(e.target.value)}
                      className="w-full bg-cyber-black border border-cyber-pink/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-pink focus:outline-none"
                    >
                      <option value="GENERAL NOTICE">GENERAL NOTICE</option>
                      <option value="EVENT NEWS">EVENT NEWS</option>
                      <option value="SCHEDULE UPDATE">SCHEDULE UPDATE</option>
                      <option value="URGENT ALERT">URGENT ALERT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-cyber-pink uppercase mb-1">
                      TARGET EVENT
                    </label>
                    <select
                      value={noticeTargetEvent}
                      onChange={(e) => setNoticeTargetEvent(e.target.value)}
                      className="w-full bg-cyber-black border border-cyber-pink/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-pink focus:outline-none"
                    >
                      <option value="ALL EVENTS">ALL EVENTS</option>
                      {OFFICIAL_EVENTS.map((ev) => (
                        <option key={ev.id} value={`${ev.number} — ${ev.title}`}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-cyber-pink uppercase mb-1">
                      PRIORITY
                    </label>
                    <select
                      value={noticePriority}
                      onChange={(e) => setNoticePriority(e.target.value)}
                      className="w-full bg-cyber-black border border-cyber-pink/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-pink focus:outline-none"
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="HIGH">HIGH (YELLOW)</option>
                      <option value="URGENT">URGENT (PINK ALERT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-pink uppercase mb-1">
                    ANNOUNCEMENT CONTENT / DETAILS
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    placeholder="Enter announcement details, instructions, room numbers, or links for participants..."
                    className="w-full bg-cyber-black border border-cyber-pink/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-pink focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishingNotice}
                  className="w-full py-4 bg-cyber-pink text-cyber-black font-display font-black text-xl italic tracking-wider clip-chamfer hover:bg-cyber-pink/90 transition-all flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(255,0,127,0.5)]"
                >
                  {isPublishingNotice ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>PUBLISHING TO MONGODB ATLAS...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>[ POST NOTICE LIVE TO USER DASHBOARDS ]</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* POSTED NOTICES LIST SECTION */}
        {activeNotices.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white mb-6 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-cyber-pink" />
              <span>ACTIVE ANNOUNCEMENTS & NOTICES ({activeNotices.length})</span>
            </h3>

            <div className="space-y-4">
              {activeNotices.map((n) => (
                <div
                  key={n.noticeId}
                  className="bg-cyber-charcoal border border-cyber-pink/40 p-5 clip-chamfer flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 clip-chamfer uppercase ${
                        n.priority === 'URGENT' ? 'bg-cyber-pink text-cyber-white' : n.priority === 'HIGH' ? 'bg-cyber-yellow text-cyber-black' : 'bg-cyber-cyan text-cyber-black'
                      }`}>
                        {n.category} [{n.priority || 'NORMAL'}]
                      </span>
                      <span className="font-mono text-xs text-cyber-muted">
                        TARGET: {n.targetEvent || 'ALL EVENTS'}
                      </span>
                    </div>

                    <h4 className="font-display text-lg font-bold italic uppercase text-cyber-white mb-1">
                      {n.title}
                    </h4>

                    <p className="font-body text-xs text-cyber-muted max-w-3xl whitespace-pre-wrap">
                      {n.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteNotice(n.noticeId)}
                    className="p-2 bg-cyber-black border border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink hover:text-cyber-black clip-chamfer transition-all shrink-0"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <SectionDivider label="END OF ADMIN CONTROL NODE" />
      </div>
    </div>
  );
};
