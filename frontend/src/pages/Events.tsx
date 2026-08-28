import React, { useEffect } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { EventCard } from '../components/EventCard';
import { SectionDivider } from '../components/SectionDivider';
import { useEvents } from '../context/EventsContext';

export const Events: React.FC = () => {
  const { events } = useEvents();

  useEffect(() => {
    document.title = 'Events Arena | HiveMind 2026';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="ARENA // ALL_CHALLENGES"
          title="ALL HIVEMIND CHALLENGES"
          subtitle="Explore the complete spectrum of five digital competitions powered by SSDC SLIET."
        />

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <SectionDivider label="END OF ARENA NODES" />
      </div>
    </div>
  );
};
