import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { TIMELINE_MILESTONES } from '../data/timeline';
import { Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Timeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(TIMELINE_MILESTONES[0]);

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
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isSelected = selectedMilestone.title === item.title;
              return (
                <button
                  key={item.title}
                  onClick={() => setSelectedMilestone(item)}
                  className="flex flex-col items-center group text-center focus:outline-none"
                >
                  <span className="font-mono text-xs font-bold text-cyber-cyan mb-3 group-hover:text-cyber-cyan-bright">
                    0{idx + 1} // {item.date}
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
          {TIMELINE_MILESTONES.map((item, idx) => (
            <div
              key={item.title}
              onClick={() => setSelectedMilestone(item)}
              className={`p-4 bg-cyber-black border clip-chamfer cursor-pointer transition-all ${
                item.title === selectedMilestone.title
                  ? 'border-cyber-cyan shadow-[0_0_15px_rgba(0,207,255,0.3)]'
                  : 'border-cyber-cyan/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyber-cyan">
                  EVENT 0{idx + 1} // {item.date}
                </span>
              </div>
              <h4 className="font-display text-lg font-bold italic uppercase text-cyber-white mt-1">
                {item.title}
              </h4>
              <p className="text-cyber-muted text-xs font-body mt-1">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Milestone Detail Card Display */}
        <motion.div
          key={selectedMilestone.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-cyber-black border-2 border-cyber-cyan p-6 md:p-8 clip-chamfer-lg relative overflow-hidden shadow-[0_0_25px_rgba(0,207,255,0.2)]"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyber-cyan font-bold tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                <span>SELECTED EVENT // DATE: {selectedMilestone.date}</span>
              </div>
              <h3 className="font-display text-3xl font-extrabold italic uppercase text-cyber-white">
                {selectedMilestone.title}
              </h3>
              <p className="text-cyber-muted text-sm font-body mt-2 max-w-2xl">
                {selectedMilestone.description}
              </p>
            </div>

            {selectedMilestone.eventId && (
              <Link
                to={`/events/${selectedMilestone.eventId}`}
                className="px-6 py-3 bg-cyber-cyan text-cyber-black font-display font-bold italic text-sm tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all uppercase flex items-center gap-2 whitespace-nowrap"
              >
                <span>VIEW EVENT SPECS</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
