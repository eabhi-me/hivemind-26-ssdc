import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Instagram, Linkedin, Globe, Users, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-cyber-black border-t border-cyber-cyan/30 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-cyber-charcoal border border-cyber-cyan/60 clip-chamfer flex items-center justify-center text-cyber-cyan">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold italic tracking-wider text-cyber-white">
                  SSDC <span className="text-cyber-cyan">HIVEMIND</span>
                </div>
                <div className="font-mono text-xs tracking-widest text-cyber-muted">
                  SLIET SOFTWARE DEVELOPMENT CLUB
                </div>
              </div>
            </Link>

            <p className="text-cyber-muted text-sm font-body max-w-sm mb-6">
              HiveMind 2026 is a month-long digital challenge festival organized by the Software Development Club at Sant Longowal Institute of Engineering & Technology (SLIET).
            </p>

            <span className="font-mono text-xs text-cyber-cyan/70">
              SYS // HIVEMIND_2026_PRODUCTION
            </span>
          </div>

          {/* Nav Links Col */}
          <div className="md:col-span-3">
            <h4 className="font-display text-lg font-bold italic uppercase tracking-wider text-cyber-white mb-4">
              QUICK NAVIGATION
            </h4>
            <ul className="space-y-2 font-display italic text-base text-cyber-muted uppercase">
              <li>
                <a href="#hero" className="hover:text-cyber-cyan transition-colors">
                  HIVEMIND 2026
                </a>
              </li>
              <li>
                <Link to="/events" className="hover:text-cyber-cyan transition-colors">
                  EVENTS ARENA
                </Link>
              </li>
              <li>
                <a href="#timeline" className="hover:text-cyber-cyan transition-colors">
                  TIMELINE
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-cyber-cyan transition-colors">
                  PRIZE VAULT
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyber-cyan transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Connect Col */}
          <div className="md:col-span-4">
            <h4 className="font-display text-lg font-bold italic uppercase tracking-wider text-cyber-white mb-4">
              CONNECT WITH SSDC
            </h4>
            <div className="flex flex-col space-y-3 font-mono text-xs">
              <a
                href="https://www.instagram.com/ssdc.sliet/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-cyber-charcoal border border-cyber-cyan/20 hover:border-cyber-cyan text-cyber-white hover:text-cyber-cyan clip-chamfer flex items-center gap-3 transition-all"
              >
                <Instagram className="w-4 h-4 text-cyber-pink shrink-0" />
                <span>INSTAGRAM // @ssdc.sliet</span>
              </a>

              <a
                href="https://www.linkedin.com/company/sliet-software-developement-club/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-cyber-charcoal border border-cyber-cyan/20 hover:border-cyber-cyan text-cyber-white hover:text-cyber-cyan clip-chamfer flex items-center gap-3 transition-all"
              >
                <Linkedin className="w-4 h-4 text-cyber-cyan shrink-0" />
                <span>LINKEDIN // SSDC SLIET</span>
              </a>

              <a
                href="https://ssdc.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-cyber-charcoal border border-cyber-cyan/20 hover:border-cyber-cyan text-cyber-white hover:text-cyber-cyan clip-chamfer flex items-center gap-3 transition-all"
              >
                <Globe className="w-4 h-4 text-cyber-cyan shrink-0" />
                <span>OFFICIAL WEBSITE // ssdc.web.app</span>
              </a>

              <a
                href="https://groups.google.com/g/ssdc-sliet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-cyber-charcoal border border-cyber-cyan/20 hover:border-cyber-cyan text-cyber-white hover:text-cyber-cyan clip-chamfer flex items-center gap-3 transition-all"
              >
                <Users className="w-4 h-4 text-cyber-cyan shrink-0" />
                <span>GOOGLE GROUP // ssdc-sliet</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cyber-cyan/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-cyber-muted">
            © 2026 SLIET Software Development Club (SSDC). All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 bg-cyber-charcoal border border-cyber-cyan/40 hover:border-cyber-cyan text-cyber-cyan clip-chamfer transition-all"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
