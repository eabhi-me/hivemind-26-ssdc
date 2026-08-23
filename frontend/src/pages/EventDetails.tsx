import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { OFFICIAL_EVENTS } from '../data/events';
import { ArrowLeft, Calendar, Clock, Trophy, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { SectionDivider } from '../components/SectionDivider';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [events, setEvents] = useState<any[]>(() => {
    const cached = localStorage.getItem('hivemind_events');
    return cached ? JSON.parse(cached) : OFFICIAL_EVENTS;
  });

  const isLoggedIn = Boolean(user || localStorage.getItem('hivemind_jwt_token'));
  
  let isAdmin = false;
  const storedUserStr = localStorage.getItem('hivemind_user');
  if (user?.role === 'admin') {
    isAdmin = true;
  } else if (storedUserStr) {
    try {
      const parsed = JSON.parse(storedUserStr);
      if (parsed.role === 'admin') isAdmin = true;
    } catch (e) {}
  }
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  const event = events.find((e) => e.id === eventId);

  useEffect(() => {
    if (event) {
      document.title = `${event.title} | HiveMind 2026`;
    }
    window.scrollTo(0, 0);
  }, [event]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await apiService.getEvents();
        const liveEvents = response.events;
        if (liveEvents && liveEvents.length > 0) {
          setEvents(liveEvents);
          localStorage.setItem('hivemind_events', JSON.stringify(liveEvents));
        }
      } catch (err) {
        console.error('Failed to load live events:', err);
      }
    };
    loadEvents();
  }, []);

  if (!event) {
    return (
      <div className="pt-32 pb-20 text-center relative z-10 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-display text-4xl text-cyber-pink italic uppercase font-bold mb-4">
          EVENT NODE NOT FOUND
        </h2>
        <p className="text-cyber-muted font-body mb-6">
          The specified event ID does not exist in the HiveMind system registry.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="px-6 py-3 bg-cyber-cyan text-cyber-black font-display font-bold italic tracking-wider clip-chamfer"
        >
          RETURN TO EVENTS ARENA
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-mono text-xs text-cyber-cyan hover:text-cyber-cyan-bright mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO CHALLENGE ARENA</span>
        </Link>

        {/* Hero Banner for Event */}
        <div className="bg-cyber-charcoal border-2 border-cyber-cyan p-6 sm:p-10 clip-chamfer-lg relative overflow-hidden shadow-[0_0_35px_rgba(0,207,255,0.2)] mb-10">
          <div className="flex flex-col gap-4">
            
            {/* Status Tag */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-black border border-cyber-cyan/40 clip-chamfer text-cyber-cyan font-mono text-xs font-bold tracking-widest uppercase">
                <span>{event.number}</span>
                <span>//</span>
                <span>STATUS: {event.status}</span>
              </div>
            </div>

            {/* Event Title with Clean Spacing & Tight Leading to Prevent Overlap */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black italic tracking-normal uppercase text-cyber-white leading-tight mt-1 mb-2 break-words">
              {event.title}
            </h1>

            {/* Tagline */}
            <p className="font-display italic text-xl sm:text-2xl text-cyber-cyan-bright tracking-wide uppercase font-bold mb-2">
              {event.tagline}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-cyber-cyan/20">
            <p className="text-cyber-muted text-base md:text-lg font-body leading-relaxed max-w-4xl">
              {event.description}
            </p>
          </div>
        </div>

        {/* EVENT INFORMATION Specs Grid */}
        <div className="mb-10">
          <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyber-cyan" />
            <span>EVENT INFORMATION</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-5 clip-chamfer">
              <span className="font-mono text-[10px] text-cyber-cyan tracking-widest block mb-1">DATE</span>
              <div className="flex items-center gap-2 font-display text-xl font-bold italic text-cyber-white">
                <Calendar className="w-4 h-4 text-cyber-cyan shrink-0" />
                <span>{event.startDate}</span>
              </div>
            </div>

            <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-5 clip-chamfer">
              <span className="font-mono text-[10px] text-cyber-cyan tracking-widest block mb-1">DURATION</span>
              <div className="flex items-center gap-2 font-display text-xl font-bold italic text-cyber-white">
                <Clock className="w-4 h-4 text-cyber-cyan shrink-0" />
                <span>{event.duration}</span>
              </div>
            </div>

            <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-5 clip-chamfer">
              <span className="font-mono text-[10px] text-cyber-cyan tracking-widest block mb-1">FORMAT</span>
              <div className="font-display text-xl font-bold italic text-cyber-white truncate">
                {event.format}
              </div>
            </div>

            <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-5 clip-chamfer">
              <span className="font-mono text-[10px] text-cyber-cyan tracking-widest block mb-1">REWARDS</span>
              <div className="flex items-center gap-2 font-display text-lg font-bold italic text-cyber-yellow">
                <Trophy className="w-4 h-4 text-cyber-yellow shrink-0" />
                <span>CASH + CERTIFICATES</span>
              </div>
            </div>
          </div>
        </div>

        {/* REWARDS & CERTIFICATION CALLOUT */}
        <div className="mb-10 bg-cyber-charcoal border border-cyber-cyan/30 p-6 clip-chamfer flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyber-black border border-cyber-cyan/40 clip-chamfer text-cyber-yellow">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-xl font-extrabold italic text-cyber-white uppercase">
                CASH PRIZES + OFFICIAL CERTIFICATES
              </h4>
              <p className="text-cyber-muted text-xs font-body">
                Top rankers in {event.title} win cash rewards and official SSDC Certificates of Excellence.
              </p>
            </div>
          </div>
        </div>

        {/* RULES LIST */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white mb-4">
            RULES & GUIDELINES
          </h3>

          <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-6 md:p-8 clip-chamfer space-y-4">
            {event.rules.map((rule: string, idx: number) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-cyber-black/60 border border-cyber-cyan/15 clip-chamfer">
                <span className="font-mono text-sm font-bold text-cyber-cyan shrink-0">
                  0{idx + 1}
                </span>
                <p className="text-cyber-muted text-sm font-body leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* REGISTER CTA BUTTON */}
        <div className="text-center">
          <Link
            to={isLoggedIn ? dashboardPath : `/register?event=${encodeURIComponent(event.number + ' — ' + event.title)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 bg-cyber-cyan text-cyber-black font-display font-black text-2xl italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all duration-300 shadow-[0_0_30px_rgba(0,207,255,0.6)] hover:shadow-[0_0_50px_rgba(0,207,255,0.9)] uppercase group"
          >
            <span>{isLoggedIn ? `[ OPEN DASHBOARD FOR ${event.title} ]` : `[ REGISTER NOW FOR ${event.title} ]`}</span>
            <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>

          <p className="mt-4 font-mono text-xs text-cyber-muted">
            {isLoggedIn ? "PROCEED TO DASHBOARD" : "DIRECT LIVE REGISTRATION VIA SSDC PORTAL"}
          </p>
        </div>

        <SectionDivider label="END OF EVENT SPECIFICATIONS" />
      </div>
    </div>
  );
};
