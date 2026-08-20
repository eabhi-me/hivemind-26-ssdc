import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Target, UserPlus, Zap, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'CHOOSE YOUR BATTLE',
      desc: 'Browse through our 5 distinct challenge nodes and select your specialized domain.',
      icon: Target,
    },
    {
      num: '02',
      title: 'REGISTER FOR THE EVENT',
      desc: 'Submit your entry via Unstop or Codeforces for individual or team challenges.',
      icon: UserPlus,
    },
    {
      num: '03',
      title: 'TAKE THE CHALLENGE',
      desc: 'Build bad UI, craft prompts, hack sandboxes, outsmart crowd theory, or code CP algorithms.',
      icon: Zap,
    },
    {
      num: '04',
      title: 'CLAIM YOUR GLORY',
      desc: 'Win cash prizes, climb leaderboard ranks, and earn official SSDC certificates.',
      icon: Award,
    },
  ];

  return (
    <section className="py-20 bg-cyber-charcoal/50 border-y border-cyber-cyan/20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="GUIDE // HOW_IT_WORKS"
          title="HOW IT WORKS"
          subtitle="Four simple steps to enter the digital arena and compete in HiveMind 2026."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-cyber-black border border-cyber-cyan/30 p-6 clip-chamfer relative group hover:border-cyber-cyan transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl font-black text-cyber-cyan text-glow-cyan">
                      {step.num}
                    </span>
                    <div className="p-2.5 bg-cyber-charcoal border border-cyber-cyan/30 text-cyber-cyan clip-chamfer group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold italic uppercase tracking-wider text-cyber-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-cyber-muted text-xs font-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-cyber-cyan/10 font-mono text-[10px] text-cyber-cyan/60 tracking-widest uppercase">
                  STEP // 0{idx + 1}_INIT
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
