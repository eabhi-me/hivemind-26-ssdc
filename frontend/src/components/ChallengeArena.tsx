import React from 'react';
import { SectionHeader } from './SectionHeader';
import { EventCard } from './EventCard';
import { OFFICIAL_EVENTS } from '../data/events';

export const ChallengeArena: React.FC = () => {
  return (
    <section id="events" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="ARENA // COMPETITION_NODES"
          title="THE CHALLENGE ARENA"
          subtitle="Five events. Five ways to think differently. Select a node to view full challenge rules and registration details."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OFFICIAL_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} featured={event.isFeatured} />
          ))}
        </div>
      </div>
    </section>
  );
};
