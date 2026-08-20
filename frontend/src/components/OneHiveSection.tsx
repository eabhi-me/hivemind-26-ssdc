import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Hexagon } from './Hexagon';
import { Palette, Code2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const OneHiveSection: React.FC = () => {
  const roles = [
    { title: 'DESIGNERS', icon: Palette, desc: 'Chaos & Aesthetics' },
    { title: 'CODERS', icon: Code2, desc: 'Algorithmic Mastery' },
    { title: 'HACKERS', icon: ShieldAlert, desc: 'Sandbox Breakers' },
    { title: 'STRATEGISTS', icon: Cpu, desc: 'Game Theory Experts' },
    { title: 'CREATORS', icon: Sparkles, desc: 'AI Media Engineering' },
  ];

  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="COMMUNITY // SLIET_SSDC"
          title="ONE HIVE. MANY MINDS."
          subtitle="Different skills. Different challenges. One unified student developer community."
        />

        {/* Roles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {roles.map((role, idx) => {
            const IconComp = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-cyber-charcoal border border-cyber-cyan/30 p-5 clip-chamfer text-center group hover:border-cyber-cyan transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,207,255,0.25)]"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-cyber-black border border-cyber-cyan/40 clip-chamfer flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold italic uppercase tracking-wider text-cyber-white group-hover:text-cyber-cyan transition-colors">
                  {role.title}
                </h3>
                <p className="text-cyber-muted text-[10px] font-mono uppercase mt-1">
                  {role.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Hexagonal Interactive Node Grid */}
        <div className="bg-cyber-charcoal/40 border border-cyber-cyan/20 p-8 clip-chamfer-lg relative overflow-hidden flex flex-col items-center">
          <div className="font-mono text-xs text-cyber-cyan mb-6 tracking-widest uppercase">
            CONNECTIVITY MATRIX // ALL DOMAINS ACTIVE
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl">
            {['DESIGN', 'PROMPTING', 'SECURITY', 'GAME THEORY', 'ALGORITHMS', 'DEVELOPMENT'].map(
              (label) => (
                <div key={label} className="animate-float">
                  <Hexagon size={110} glow>
                    <span className="font-mono text-xs font-bold text-cyber-cyan text-center">
                      {label}
                    </span>
                  </Hexagon>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
