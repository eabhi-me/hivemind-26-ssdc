import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/SectionHeader';
import { Trophy, ChevronRight, AlertTriangle } from 'lucide-react';
import { WINNERS_DATA } from '../data/winners';

export const WinnersHub: React.FC = () => {
  useEffect(() => {
    document.title = 'Winners Arena | HiveMind 2026';
    window.scrollTo(0, 0);
  }, []);

  const eventsList = Object.values(WINNERS_DATA);

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="HALL_OF_FAME // WINNERS"
          title="CHALLENGE CHAMPIONS"
          subtitle="Explore the brilliant minds who conquered the HiveMind 2026 challenges."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsList.map((event) => (
            <div
              key={event.eventId}
              className={`bg-cyber-charcoal border clip-chamfer relative overflow-hidden group transition-all duration-300 flex flex-col justify-between ${
                event.isPublished
                  ? 'border-cyber-yellow/40 hover:border-cyber-yellow hover:shadow-[0_0_25px_rgba(255,215,0,0.25)]'
                  : 'border-cyber-cyan/20 opacity-70 grayscale'
              }`}
            >
              <div className="p-6 md:p-8 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-xs font-bold tracking-widest bg-cyber-black px-2.5 py-1 border clip-chamfer ${
                    event.isPublished ? 'text-cyber-yellow border-cyber-yellow/30' : 'text-cyber-muted border-cyber-cyan/30'
                  }`}>
                    {event.eventId.replace('-', ' ').toUpperCase()}
                  </span>
                  
                  {!event.isPublished && (
                    <span className="font-mono text-[10px] tracking-widest text-cyber-muted bg-cyber-black px-2 py-0.5 border border-cyber-cyan/30 uppercase">
                      TBA
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4 mb-3">
                  <div className={`p-3 bg-cyber-black border clip-chamfer transition-all ${
                    event.isPublished ? 'border-cyber-yellow/40 text-cyber-yellow group-hover:scale-110 group-hover:border-cyber-yellow' : 'border-cyber-cyan/20 text-cyber-muted'
                  }`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold italic uppercase tracking-wider text-cyber-white group-hover:text-cyber-yellow transition-colors leading-none">
                      {event.eventTitle}
                    </h3>
                  </div>
                </div>

                {event.isPublished ? (
                  <p className="text-cyber-muted text-sm font-body mt-4">
                    The results are in! Click to view the champions and special mentions for this challenge.
                  </p>
                ) : (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-cyber-black/50 border border-cyber-cyan/20 clip-chamfer">
                    <AlertTriangle className="w-4 h-4 text-cyber-cyan" />
                    <span className="font-mono text-xs text-cyber-muted">RESULTS PENDING</span>
                  </div>
                )}
              </div>

              {event.isPublished && (
                <div className="px-6 pb-6 pt-0 relative z-10">
                  <Link
                    to={`/winners/${event.eventId}`}
                    className="w-full py-3 bg-cyber-black hover:bg-cyber-yellow text-cyber-white hover:text-cyber-black border border-cyber-yellow/50 hover:border-cyber-yellow font-display font-bold italic text-base tracking-wider clip-chamfer transition-all duration-300 flex items-center justify-center gap-2 uppercase group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                  >
                    <span>VIEW RESULTS</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
