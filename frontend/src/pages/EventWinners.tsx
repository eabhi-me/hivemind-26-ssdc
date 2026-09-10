import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trophy, Medal, ArrowLeft, Star, Award } from 'lucide-react';
import { WINNERS_DATA, WinnerInfo } from '../data/winners';

export const EventWinners: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const eventData = eventId ? WINNERS_DATA[eventId] : null;

  useEffect(() => {
    if (eventData) {
      document.title = `${eventData.eventTitle} Winners | HiveMind 2026`;
    }
    window.scrollTo(0, 0);
  }, [eventData]);

  if (!eventData || !eventData.isPublished) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4 relative z-10">
        <Trophy className="w-16 h-16 text-cyber-cyan/30 mb-6" />
        <h1 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-wider text-cyber-white mb-4">
          RESULTS PENDING
        </h1>
        <p className="text-cyber-muted font-body mb-8 max-w-md">
          The winners for this event have not been published yet or the event does not exist.
        </p>
        <button
          onClick={() => navigate('/winners')}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyber-charcoal text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black font-display font-bold italic tracking-widest clip-chamfer transition-all duration-300 uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HALL OF FAME</span>
        </button>
      </div>
    );
  }

  const renderWinnerCard = (winner: WinnerInfo, index: number) => {
    let icon, colorClass, isFirst;
    if (index === 0) {
      icon = <Trophy className="w-16 h-16 text-cyber-yellow" />;
      colorClass = 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/50';
      isFirst = true;
    } else if (index === 1) {
      icon = <Medal className="w-12 h-12 text-gray-300" />;
      colorClass = 'bg-gray-500/20 text-gray-300 border border-gray-500/50';
      isFirst = false;
    } else if (index === 2) {
      icon = <Award className="w-12 h-12 text-orange-400" />;
      colorClass = 'bg-orange-500/20 text-orange-400 border border-orange-500/50';
      isFirst = false;
    } else {
      icon = <Star className="w-12 h-12 text-cyber-cyan" />;
      colorClass = 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50';
      isFirst = false;
    }

    return (
      <div key={index} className={`bg-cyber-black border p-6 clip-chamfer relative overflow-hidden group ${
        isFirst ? 'border-cyber-yellow md:col-span-2 shadow-[0_0_20px_rgba(255,215,0,0.15)]' : 'border-cyber-cyan/30'
      }`}>
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          {icon}
        </div>
        
        <h4 className={`font-mono text-xs font-bold tracking-widest uppercase mb-4 px-2 py-1 inline-block ${colorClass}`}>
          {winner.category}
        </h4>
        
        <div className="mb-2">
          <h3 className={`font-display font-black italic uppercase tracking-wider leading-none ${
            isFirst ? 'text-4xl text-cyber-yellow' : 'text-2xl text-cyber-white'
          }`}>
            {winner.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mt-4 text-cyber-muted font-mono text-sm">
          <span>{winner.college}</span>
          {winner.batchYear && (
            <>
              <span className="text-cyber-cyan/50">•</span>
              <span>Class of {winner.batchYear}</span>
            </>
          )}
        </div>

        {winner.submissionLink && (
          <div className="mt-6">
            <a
              href={winner.submissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 font-mono text-xs font-bold tracking-widest clip-chamfer transition-all duration-300 uppercase ${
                isFirst 
                  ? 'bg-cyber-yellow/20 text-cyber-yellow hover:bg-cyber-yellow hover:text-cyber-black border border-cyber-yellow/50' 
                  : 'bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black border border-cyber-cyan/30'
              }`}
            >
              [ VIEW SUBMISSION ]
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/winners" className="inline-flex items-center gap-2 text-cyber-cyan hover:text-cyber-yellow font-mono text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HALL OF FAME</span>
        </Link>

        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-cyber-charcoal border border-cyber-yellow/40 clip-chamfer mb-6 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
            <Trophy className="w-10 h-10 text-cyber-yellow" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-wider text-cyber-white mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            {eventData.eventTitle} <span className="text-cyber-yellow">CHAMPIONS</span>
          </h1>
        </div>

        {eventData.winners && eventData.winners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {eventData.winners.map((winner, idx) => renderWinnerCard(winner, idx))}
          </div>
        )}

        {(eventData.specialMentions && eventData.specialMentions.length > 0) && (
          <div className="mb-8 bg-cyber-charcoal border border-cyber-cyan/30 p-6 clip-chamfer">
            <h3 className="font-display text-xl font-bold italic uppercase tracking-wider text-cyber-cyan mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              SPECIAL MENTIONS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {eventData.specialMentions.map((mention, idx) => (
                <div key={idx} className="bg-cyber-black/50 border border-cyber-cyan/15 p-4 clip-chamfer flex flex-col justify-between group hover:border-cyber-cyan/50 transition-colors">
                  <div>
                    {mention.category && (
                      <span className="font-mono text-[10px] tracking-widest uppercase text-cyber-cyan-bright bg-cyber-cyan/10 px-1.5 py-0.5 border border-cyber-cyan/30 mb-2 inline-block">
                        {mention.category}
                      </span>
                    )}
                    <h4 className="font-display font-bold italic tracking-wider text-cyber-white text-lg">
                      {mention.name}
                    </h4>
                  </div>
                  
                  {mention.submissionLink && (
                    <div className="mt-4">
                      <a
                        href={mention.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-cyber-cyan hover:text-cyber-yellow font-mono text-[10px] font-bold tracking-widest transition-colors uppercase"
                      >
                        [ VIEW SUBMISSION ]
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {eventData.notes && (
          <div className="bg-cyber-charcoal/50 border border-cyber-charcoal-light p-6 clip-chamfer">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-cyber-muted mb-2">
              JUDGES' NOTES
            </h3>
            <p className="text-cyber-white/80 font-body text-sm leading-relaxed italic">
              "{eventData.notes}"
            </p>
          </div>
        )}

        {eventData.allSubmissions && eventData.allSubmissions.length > 0 && (
          <div className="mt-8 bg-cyber-charcoal border border-cyber-cyan/30 p-6 clip-chamfer">
            <h3 className="font-display text-xl font-bold italic uppercase tracking-wider text-cyber-cyan mb-4">
              ALL SUBMISSIONS ({eventData.allSubmissions.length})
            </h3>
            <p className="text-cyber-muted text-sm font-body mb-6">
              Dive into the chaos. Here are all the raw HTML files submitted for this event. 
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {eventData.allSubmissions.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyber-black/50 border border-cyber-cyan/20 hover:border-cyber-yellow hover:text-cyber-yellow text-cyber-cyan text-center py-2 px-3 clip-chamfer font-mono text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase truncate"
                  title={link.split('/').pop()}
                >
                  HTML #{idx + 1}
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
