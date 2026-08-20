import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { padZero } from '../utils/formatDate';
import { Clock, Zap } from 'lucide-react';
import { OFFICIAL_EVENTS } from '../data/events';
import { Link } from 'react-router-dom';

interface CountdownProps {
  targetDate?: string;
  title?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate = '2026-09-01T00:00:00Z',
  title = 'THE HIVE OPENS IN',
}) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);
  const activeEvent = OFFICIAL_EVENTS[0]; // First active event

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-8 relative z-20">
      <div className="bg-cyber-charcoal border-2 border-cyber-cyan/50 p-6 md:p-8 clip-chamfer-lg relative overflow-hidden shadow-[0_0_30px_rgba(0,207,255,0.15)]">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-cyan/10 blur-2xl pointer-events-none" />

        {!isExpired ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/40 clip-chamfer text-cyber-cyan">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block font-bold">
                  SYS // PROTOCOL_COUNTDOWN
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-extrabold italic uppercase tracking-wider text-cyber-white">
                  {title}
                </h3>
              </div>
            </div>

            {/* Countdown Grid Units */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center">
              {[
                { label: 'DAYS', val: days },
                { label: 'HOURS', val: hours },
                { label: 'MINS', val: minutes },
                { label: 'SECS', val: seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-cyber-black border border-cyber-cyan/30 px-3 sm:px-5 py-3 clip-chamfer min-w-[65px] sm:min-w-[85px]"
                >
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-cyber-cyan text-glow-cyan block">
                    {padZero(item.val)}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs tracking-widest text-cyber-muted uppercase block mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Challenge Alert Banner */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan clip-chamfer">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest uppercase">
                  STATUS // ARENA IS LIVE
                </span>
                <h3 className="font-display text-2xl font-extrabold italic uppercase text-cyber-white">
                  CURRENT CHALLENGE: {activeEvent.title}
                </h3>
              </div>
            </div>
            <Link
              to={`/events/${activeEvent.id}`}
              className="px-6 py-2.5 bg-cyber-cyan text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all uppercase"
            >
              [ ENTER CHALLENGE ]
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
