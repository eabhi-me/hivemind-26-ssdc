import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { useEvents } from '../context/EventsContext';
import { Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Timeline: React.FC = () => {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  React.useEffect(() => {
    if (!selectedEventId && events && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const selectedEvent = events?.find((e) => e.id === selectedEventId) || events?.[0];

  if (!events || events.length === 0 || !selectedEvent) {
    return null;
  }

  return (
    <section id="timeline" className="py-20 bg-cyber-charcoal/40 border-y border-cyber-cyan/20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="SCHEDULE // HIVEMIND_2026"
          title="EVENT TIMELINE"
          subtitle="A complete roadmap of all 5 HiveMind 2026 events. Exact dates to be announced soon."
        />

        {/* Desktop Horizontal Timeline - 5 Core Events */}
        <div className="hidden lg:block relative py-8 mb-10">
          {/* Connector axis line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-cyber-cyan/30 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {events.map((item, idx) => {
              const isSelected = selectedEventId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedEventId(item.id)}
                  className="flex flex-col items-center group text-center focus:outline-none"
                >
                  <span className="font-mono text-xs font-bold text-cyber-cyan mb-3 group-hover:text-cyber-cyan-bright">
                    0{idx + 1} // {item.startDate === 'To Be Announced' ? 'TBA' : item.startDate}
                  </span>

                  <div
                    className={`w-12 h-12 clip-chamfer flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-cyber-cyan text-cyber-black border-2 border-cyber-white shadow-[0_0_20px_rgba(0,207,255,0.8)] scale-110'
                        : 'bg-cyber-black border border-cyber-cyan/40 text-cyber-cyan group-hover:border-cyber-cyan'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>

                  <span className="font-display italic text-sm uppercase text-cyber-white mt-3 font-bold line-clamp-2 max-w-[140px]">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-4 mb-8 relative pl-6 border-l-2 border-cyber-cyan/40">
          {events.map((item, idx) => (
            <div
              key={item.id}
              className={`relative pl-4 py-3 cursor-pointer transition-colors ${
                selectedEventId === item.id ? 'bg-cyber-cyan/10 border-l-2 border-cyber-cyan' : 'border-l-2 border-transparent'
              }`}
              onClick={() => setSelectedEventId(item.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyber-cyan block mb-1">
                  0{idx + 1} // {item.startDate === 'To Be Announced' ? 'TBA' : item.startDate}
                </span>
              </div>
              <h4 className="font-display text-lg font-bold italic uppercase text-cyber-white mt-1">
                {item.title}
              </h4>
            </div>
          ))}
        </div>

        {/* Milestone Detail Card Display */}
        <div className="bg-cyber-black/80 border border-cyber-cyan/30 p-6 md:p-8 mt-4 clip-chamfer min-h-[160px] flex items-center shadow-[0_0_20px_rgba(0,207,255,0.05)]">
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-cyan font-bold tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>SELECTED EVENT // {selectedEvent.startDate}</span>
                </div>
                {selectedEvent.isFeatured && (
                  <span className="px-2 py-1 bg-cyber-pink/20 text-cyber-pink font-mono text-[10px] font-bold border border-cyber-pink/30 clip-chamfer">
                    HIGHLIGHT
                  </span>
                )}
              </div>
              <h4 className="font-display text-2xl md:text-3xl font-bold uppercase text-cyber-white tracking-wider">
                {selectedEvent.title}
              </h4>
              <p className="text-cyber-muted font-body text-sm md:text-base leading-relaxed max-w-2xl mt-2">
                {selectedEvent.description}
              </p>
            </div>

            {selectedEvent.id && (
              <Link
                to={`/events/${selectedEvent.id}`}
                className="px-6 py-3 bg-cyber-cyan text-cyber-black font-display font-bold italic text-sm tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all uppercase flex items-center gap-2 whitespace-nowrap"
              >
                <span>VIEW EVENT SPECS</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
        </motion.div>
        </div>
      </div>
    </section>
  );
};
