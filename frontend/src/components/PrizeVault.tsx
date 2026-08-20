import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { PRIZE_VAULT_CONFIG } from '../data/prizes';
import { Trophy, Award, Coins, ShieldCheck, Zap } from 'lucide-react';

export const PrizeVault: React.FC = () => {
  const prizeHighlights = [
    {
      title: 'CASH REWARDS',
      desc: 'Substantial cash prizes allocated across top performers in all 5 events.',
      icon: Coins,
      accent: 'border-cyber-yellow text-cyber-yellow',
    },
    {
      title: 'CERTIFICATES OF EXCELLENCE',
      desc: 'Official SLIET Software Development Club (SSDC) certificates for all winners and participants.',
      icon: Award,
      accent: 'border-cyber-cyan text-cyber-cyan',
    },
    {
      title: 'LEADERBOARD GLORY',
      desc: 'Recognition across institutional platforms, SSDC hall of fame, and special category honors.',
      icon: ShieldCheck,
      accent: 'border-cyber-pink text-cyber-pink',
    },
  ];

  return (
    <section id="prizes" className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="REWARDS // PRIZE_VAULT"
          title="THE PRIZE VAULT"
          subtitle="Compete across 5 challenges to earn glory and a piece of the grand festival prize pool."
        />

        {/* Central Prominent Prize Pool Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center bg-gradient-to-b from-cyber-charcoal via-cyber-charcoal-light to-cyber-charcoal border-2 border-cyber-cyan p-8 md:p-14 clip-chamfer-lg relative overflow-hidden shadow-[0_0_40px_rgba(0,207,255,0.25)]"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyber-cyan/15 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyber-black border border-cyber-cyan/40 clip-chamfer mb-6 text-cyber-yellow font-mono text-xs font-bold tracking-widest">
            <Trophy className="w-4 h-4 text-cyber-yellow animate-bounce" />
            <span>OFFICIAL CUMULATIVE PRIZE POOL</span>
          </div>

          <h3 className="font-display text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tight text-cyber-cyan text-glow-cyan uppercase leading-none mb-6">
            {PRIZE_VAULT_CONFIG.totalDisplay}
          </h3>

          <p className="text-cyber-white font-display italic text-lg md:text-2xl uppercase tracking-wider max-w-3xl mx-auto leading-relaxed">
            GRAND CASH PRIZE POOL + CERTIFICATES OF EXCELLENCE FOR ALL TOP RANKERS
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 font-mono text-xs text-cyber-muted">
            <span className="px-3 py-1 bg-cyber-black border border-cyber-cyan/30 clip-chamfer">
              SYS // 5_CHALLENGES
            </span>
            <span className="px-3 py-1 bg-cyber-black border border-cyber-cyan/30 clip-chamfer">
              POOL // ₹20,000 TOTAL
            </span>
            <span className="px-3 py-1 bg-cyber-black border border-cyber-cyan/30 clip-chamfer">
              ORG // SSDC SLIET
            </span>
          </div>
        </motion.div>

        {/* Prize Perks Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {prizeHighlights.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-cyber-charcoal border ${item.accent.split(' ')[0]} p-6 clip-chamfer flex flex-col justify-between group hover:scale-105 transition-transform duration-300`}
              >
                <div>
                  <div className="w-12 h-12 mb-4 bg-cyber-black border clip-chamfer flex items-center justify-center">
                    <IconComp className={`w-6 h-6 ${item.accent.split(' ')[1]}`} />
                  </div>
                  <h4 className="font-display text-xl font-extrabold italic uppercase tracking-wider text-cyber-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-cyber-muted text-xs font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-cyber-cyan/15 flex items-center gap-2 font-mono text-[10px] text-cyber-cyan">
                  <Zap className="w-3 h-3 text-cyber-cyan" />
                  <span>PERK // 0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Institutional Certificate Banner */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 font-mono text-xs text-cyber-muted">
          <Award className="w-4 h-4 text-cyber-cyan" />
          <span>OFFICIAL CERTIFICATES ISSUED BY SLIET SOFTWARE DEVELOPMENT CLUB (SSDC)</span>
        </div>
      </div>
    </section>
  );
};
