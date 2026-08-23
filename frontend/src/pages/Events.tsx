import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { EventCard } from '../components/EventCard';
import { OFFICIAL_EVENTS } from '../data/events';
import { SectionDivider } from '../components/SectionDivider';
import { apiService } from '../services/api';

export const Events: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'ACTIVE'>('ALL');
  const [events, setEvents] = useState<any[]>(() => {
    const cached = localStorage.getItem('hivemind_events');
    return cached ? JSON.parse(cached) : OFFICIAL_EVENTS;
  });

  useEffect(() => {
    document.title = 'Events Arena | HiveMind 2026';
    window.scrollTo(0, 0);

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

  const filteredEvents = events.filter((event) => {
    if (filter === 'ALL') return true;
    return event.status === filter;
  });

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="ARENA // ALL_CHALLENGES"
          title="ALL HIVEMIND CHALLENGES"
          subtitle="Explore the complete spectrum of five digital competitions powered by SSDC SLIET."
        />

        {/* Filter Bar */}
        <div className="flex justify-center mb-10">
          <div className="bg-cyber-charcoal border border-cyber-cyan/30 p-1.5 clip-chamfer inline-flex gap-2 font-mono text-xs">
            {(['ALL', 'UPCOMING', 'ACTIVE'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-5 py-2 clip-chamfer font-bold tracking-widest transition-all ${
                  filter === mode
                    ? 'bg-cyber-cyan text-cyber-black shadow-[0_0_12px_rgba(0,207,255,0.6)]'
                    : 'text-cyber-muted hover:text-cyber-white'
                }`}
              >
                {mode} [{events.filter((e) => mode === 'ALL' || e.status === mode).length}]
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <SectionDivider label="END OF ARENA NODES" />
      </div>
    </div>
  );
};
