import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EventItem } from '../types/event';
import { ArrowRight, Trophy, Calendar, Clock, LayoutGrid, Cpu, ShieldAlert, BrainCircuit, Terminal } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutGrid':
        return LayoutGrid;
      case 'Cpu':
        return Cpu;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'BrainCircuit':
        return BrainCircuit;
      case 'Terminal':
        return Terminal;
      default:
        return LayoutGrid;
    }
  };

  const IconComp = getIcon(event.icon);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`bg-cyber-charcoal border clip-chamfer relative overflow-hidden group transition-all duration-300 flex flex-col justify-between ${
        featured
          ? 'border-cyber-cyan shadow-[0_0_30px_rgba(0,207,255,0.3)] md:col-span-2'
          : 'border-cyber-cyan/30 hover:border-cyber-cyan hover:shadow-[0_0_25px_rgba(0,207,255,0.25)]'
      }`}
    >
      {/* Background oversized event number watermark */}
      <span className="absolute -top-6 -right-4 font-display font-black text-8xl text-cyber-charcoal-light/40 group-hover:text-cyber-cyan/15 group-hover:scale-110 transition-all pointer-events-none select-none italic">
        {event.number.replace('EVENT_', '')}
      </span>

      <div className="p-6 md:p-8 relative z-10">
        {/* Top bar with event number and status */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest bg-cyber-black px-2.5 py-1 border border-cyber-cyan/30 clip-chamfer">
            {event.number}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-cyber-cyan-bright bg-cyber-cyan/10 px-2 py-0.5 border border-cyber-cyan/30 uppercase">
            STATUS // {event.status}
          </span>
        </div>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="p-3 bg-cyber-black border border-cyber-cyan/40 clip-chamfer text-cyber-cyan group-hover:scale-110 group-hover:border-cyber-cyan transition-all">
            <IconComp className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold italic uppercase tracking-wider text-cyber-white group-hover:text-cyber-cyan transition-colors leading-none">
              {event.title}
            </h3>
            <p className="font-display italic text-sm text-cyber-cyan-bright tracking-wider mt-1 uppercase font-semibold">
              {event.tagline}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-cyber-muted text-sm font-body mb-6 line-clamp-3">
          {event.description}
        </p>

        {/* Metadata Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-cyber-black/70 p-4 border border-cyber-cyan/20 clip-chamfer font-mono text-xs">
          <div className="flex items-center gap-2 text-cyber-muted">
            <Calendar className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
            <span className="truncate">{event.startDate}</span>
          </div>

          <div className="flex items-center gap-2 text-cyber-muted">
            <Clock className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
            <span>{event.duration}</span>
          </div>

          <div className="flex items-center gap-2 text-cyber-muted">
            <span className="text-cyber-cyan font-bold">FMT:</span>
            <span className="truncate">{event.format}</span>
          </div>

          <div className="flex items-center gap-2 text-cyber-cyan font-bold">
            <Trophy className="w-3.5 h-3.5 text-cyber-yellow shrink-0" />
            <span className="text-cyber-yellow">CASH + CERTIFICATES</span>
          </div>
        </div>
      </div>

      {/* Footer CTA Button */}
      <div className="px-6 pb-6 pt-0 relative z-10">
        <Link
          to={`/events/${event.id}`}
          className="w-full py-3 bg-cyber-black hover:bg-cyber-cyan text-cyber-white hover:text-cyber-black border border-cyber-cyan/50 hover:border-cyber-cyan font-display font-bold italic text-base tracking-wider clip-chamfer transition-all duration-300 flex items-center justify-center gap-2 uppercase group-hover:shadow-[0_0_15px_rgba(0,207,255,0.4)]"
        >
          <span>VIEW CHALLENGE DETAILS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};
