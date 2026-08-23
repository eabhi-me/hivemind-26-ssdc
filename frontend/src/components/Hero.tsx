import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, LayoutGrid, ShieldAlert, BrainCircuit, Terminal } from 'lucide-react';
import { CircuitBackground } from './CircuitBackground';
import { useAuth } from '../context/AuthContext';

export const Hero: React.FC = () => {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user || localStorage.getItem('hivemind_jwt_token'));
  
  let isAdmin = false;
  const storedUserStr = localStorage.getItem('hivemind_user');
  if (user?.role === 'admin') {
    isAdmin = true;
  } else if (storedUserStr) {
    try {
      const parsed = JSON.parse(storedUserStr);
      if (parsed.role === 'admin') isAdmin = true;
    } catch (e) {}
  }
  
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isAdmin ? '[ ADMIN CONTROL ]' : '[ MY DASHBOARD ]';

  const nodes = [
    {
      id: '01',
      title: 'BAD UI',
      desc: 'DESIGN CHAOS',
      icon: LayoutGrid,
      accent: 'border-cyber-cyan text-cyber-cyan',
      posClass: 'top-2 left-2 md:top-4 md:left-4',
      lineTarget: { x1: '20%', y1: '15%', x2: '50%', y2: '48%' },
    },
    {
      id: '02',
      title: 'REV AI',
      desc: 'PROMPT BATTLE',
      icon: Cpu,
      accent: 'border-cyber-cyan text-cyber-cyan',
      posClass: 'top-2 right-2 md:top-4 md:right-4',
      lineTarget: { x1: '80%', y1: '15%', x2: '50%', y2: '48%' },
    },
    {
      id: '03',
      title: 'CTF',
      desc: 'PSEUDO-BREACH',
      icon: ShieldAlert,
      accent: 'border-cyber-pink text-cyber-pink',
      posClass: 'top-1/2 -translate-y-1/2 left-0',
      lineTarget: { x1: '12%', y1: '50%', x2: '50%', y2: '50%' },
    },
    {
      id: '04',
      title: 'GAME THEORY',
      desc: 'MIND OVER MAJORITY',
      icon: BrainCircuit,
      accent: 'border-cyber-cyan text-cyber-cyan',
      posClass: 'top-1/2 -translate-y-1/2 right-0',
      lineTarget: { x1: '88%', y1: '50%', x2: '50%', y2: '50%' },
    },
    {
      id: '05',
      title: 'ALGO ARENA',
      desc: 'CODEFORCES CP',
      icon: Terminal,
      accent: 'border-cyber-yellow text-cyber-yellow',
      posClass: 'bottom-2 left-1/2 -translate-x-1/2',
      lineTarget: { x1: '50%', y1: '85%', x2: '50%', y2: '52%' },
    },
  ];

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Circuit background overlay */}
      <CircuitBackground />

      {/* Watermark 2026 background typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display font-black text-[22vw] leading-none text-cyber-charcoal-light/25 tracking-tighter italic">
          2026
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* SSDC Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-charcoal border border-cyber-cyan/40 clip-chamfer mb-6">
              <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
              <span className="font-mono text-xs font-bold tracking-widest text-cyber-cyan uppercase">
                SSDC PRESENTS
              </span>
            </div>

            {/* Title - Sharp high contrast display */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-black italic tracking-tight uppercase text-cyber-white leading-none mb-4">
              HIVEMIND <br />
              <span className="text-cyber-cyan text-glow-cyan">2026</span>
            </h1>

            {/* Tagline */}
            <p className="font-display italic text-2xl sm:text-3xl text-cyber-muted tracking-wide mb-6 uppercase">
              A MONTH OF CHALLENGES. <br />
              <span className="text-cyber-white font-bold">ONE HIVE. MANY MINDS.</span>
            </p>

            {/* Subtext */}
            <p className="text-cyber-muted text-base sm:text-lg max-w-xl font-body mb-8 leading-relaxed">
              A high-octane digital competition arena organized by the SLIET Software Development Club. Five challenges across UI design, AI prompting, cybersecurity, game theory, and competitive programming.
            </p>

            {/* Actions CTA */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#events"
                className="w-full sm:w-auto px-8 py-4 bg-cyber-cyan text-cyber-black font-display font-black text-lg italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all duration-300 shadow-[0_0_15px_rgba(0,207,255,0.4)] flex items-center justify-center gap-3 uppercase group"
              >
                <span>EXPLORE EVENTS</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to={isLoggedIn ? dashboardPath : "/register"}
                className="w-full sm:w-auto px-8 py-4 bg-cyber-charcoal hover:bg-cyber-charcoal-light text-cyber-white border border-cyber-cyan/50 font-display font-bold text-lg italic tracking-wider clip-chamfer transition-all duration-300 flex items-center justify-center gap-2 uppercase hover:border-cyber-cyan"
              >
                {isLoggedIn ? dashboardLabel : '[ REGISTER NOW ]'}
              </Link>
            </div>

            {/* Terminal meta tags */}
            <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs text-cyber-muted">
              <span className="px-2.5 py-1 bg-cyber-charcoal border border-cyber-cyan/20 clip-chamfer">
                SYS // HIVEMIND_2026
              </span>
              <span className="px-2.5 py-1 bg-cyber-charcoal border border-cyber-cyan/20 clip-chamfer">
                LOCATION // SLIET
              </span>
              <span className="px-2.5 py-1 bg-cyber-charcoal border border-cyber-cyan/20 clip-chamfer">
                STATUS // REGISTRATIONS OPEN
              </span>
            </div>
          </motion.div>

          {/* Right Column: Clean Non-Overlapping Cyber Network Matrix */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] p-4"
          >
            {/* Subtle Cyan Radial Backlight */}
            <div className="absolute w-80 h-80 rounded-full bg-cyber-cyan/10 blur-2xl pointer-events-none" />

            <div className="relative w-full max-w-lg h-[440px] border border-cyber-cyan/20 bg-cyber-charcoal/40 clip-chamfer p-4 flex items-center justify-center overflow-hidden">
              
              {/* Connecting Lines SVG Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyber-cyan/40 stroke-[1.5]">
                {nodes.map((node) => (
                  <g key={`line-${node.id}`}>
                    <line
                      x1={node.lineTarget.x1}
                      y1={node.lineTarget.y1}
                      x2={node.lineTarget.x2}
                      y2={node.lineTarget.y2}
                      strokeDasharray="4 3"
                    />
                    <circle
                      cx={node.lineTarget.x1}
                      cy={node.lineTarget.y1}
                      r="3"
                      fill="#00CFFF"
                    />
                  </g>
                ))}
              </svg>

              {/* Central Core Hexagon Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-40 h-40 bg-cyber-black border-2 border-cyber-cyan clip-chamfer flex flex-col items-center justify-center p-3 text-center shadow-[0_0_25px_rgba(0,207,255,0.3)]">
                  <span className="font-mono text-[10px] text-cyber-cyan font-bold tracking-widest block mb-1">
                    SSDC CORE
                  </span>
                  <span className="font-display text-2xl font-black italic text-cyber-white tracking-wider block leading-tight">
                    HIVEMIND
                  </span>
                  <span className="font-mono text-[10px] text-cyber-cyan-bright font-bold block mt-1">
                    2026 // SLIET
                  </span>
                </div>
              </div>

              {/* Satellite Peripheral Nodes */}
              {nodes.map((node) => {
                const IconComponent = node.icon;
                return (
                  <div
                    key={node.id}
                    className={`absolute z-20 ${node.posClass}`}
                  >
                    <div
                      className={`bg-cyber-black/90 border ${node.accent} px-3 py-2 clip-chamfer flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform cursor-pointer`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[9px] text-cyber-muted leading-none">
                          NODE_{node.id}
                        </span>
                        <span className="font-display text-xs md:text-sm font-extrabold italic uppercase tracking-wide leading-tight whitespace-nowrap">
                          {node.title}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
