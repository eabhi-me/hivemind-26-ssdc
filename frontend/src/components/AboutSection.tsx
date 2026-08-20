import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Brain, Sparkles, ShieldAlert, Users, Code } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const steps = [
    { label: 'THINK', desc: 'Design Frustration', icon: Brain, color: 'text-cyber-cyan' },
    { label: 'CREATE', desc: 'AI Prompt Engineering', icon: Sparkles, color: 'text-cyber-bright' },
    { label: 'BREAK', desc: 'Web CTF Exploits', icon: ShieldAlert, color: 'text-cyber-pink' },
    { label: 'OUTSMART', desc: 'Game Theory Matrix', icon: Users, color: 'text-cyber-cyan' },
    { label: 'CODE', desc: 'Competitive Finale', icon: Code, color: 'text-cyber-yellow' },
  ];

  return (
    <section id="about" className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="MISSION // ABOUT_HIVEMIND"
          title="NOT JUST ANOTHER COLLEGE FEST."
          subtitle="HiveMind 2026 is a month-long challenge festival organized by the SLIET Software Development Club (SSDC). Five distinct challenges testing five different core skill sets across 30 intense days."
        />

        {/* Visual Pipeline Progression */}
        <div className="mt-14 relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-cyber-charcoal border border-cyber-cyan/30 p-6 clip-chamfer flex flex-col items-center text-center group hover:border-cyber-cyan transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,207,255,0.25)] relative"
                >
                  <div className="w-12 h-12 mb-4 bg-cyber-black border border-cyber-cyan/40 clip-chamfer flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <span className="font-mono text-xs text-cyber-muted mb-1">STEP 0{idx + 1}</span>
                  
                  <h3 className={`font-display text-2xl font-black italic uppercase tracking-wider mb-2 ${step.color}`}>
                    {step.label}
                  </h3>

                  <p className="text-cyber-muted text-xs font-body uppercase tracking-wide">
                    {step.desc}
                  </p>

                  {/* Indicator Arrow for Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 font-mono text-cyber-cyan font-bold text-lg">
                      →
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
