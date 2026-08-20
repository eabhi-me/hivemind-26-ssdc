import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { TOTAL_PRIZE_POOL_NUMERIC, TOTAL_PRIZE_POOL_DISPLAY } from '../data/events';
import { Trophy, Calendar, Layers, Clock } from 'lucide-react';

export const Stats: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const eventsCount = useAnimatedCounter(5, 1500, isInView);
  const monthCount = useAnimatedCounter(1, 1000, isInView);
  const daysCount = useAnimatedCounter(30, 1800, isInView);
  const prizeCount = useAnimatedCounter(TOTAL_PRIZE_POOL_NUMERIC, 2200, isInView);

  const stats = [
    {
      id: 'events',
      icon: Layers,
      value: `0${eventsCount}`,
      label: 'CHALLENGE EVENTS',
      sysTag: 'METRIC // 01',
    },
    {
      id: 'month',
      icon: Calendar,
      value: `0${monthCount}`,
      label: 'MONTH OF ARENA',
      sysTag: 'METRIC // 02',
    },
    {
      id: 'days',
      icon: Clock,
      value: `${daysCount}`,
      label: 'DAYS OF BATTLES',
      sysTag: 'METRIC // 03',
    },
    {
      id: 'prize',
      icon: Trophy,
      value: `₹${prizeCount.toLocaleString('en-IN')}`,
      displayStatic: TOTAL_PRIZE_POOL_DISPLAY,
      label: 'TOTAL PRIZE POOL',
      sysTag: 'METRIC // 04',
      highlight: true,
    },
  ];

  return (
    <section ref={ref} className="py-12 bg-cyber-charcoal/60 border-y border-cyber-cyan/20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 bg-cyber-black border clip-chamfer relative group transition-all duration-300 ${
                  stat.highlight
                    ? 'border-cyber-cyan shadow-[0_0_20px_rgba(0,207,255,0.2)]'
                    : 'border-cyber-cyan/30 hover:border-cyber-cyan/60'
                }`}
              >
                {/* Tech tag */}
                <span className="font-mono text-[10px] text-cyber-cyan/70 tracking-widest block mb-2">
                  {stat.sysTag}
                </span>

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-display text-4xl sm:text-5xl font-black italic tracking-tight ${
                      stat.highlight ? 'text-cyber-cyan text-glow-cyan' : 'text-cyber-white'
                    }`}
                  >
                    {stat.value}
                  </span>
                  <div className="p-2.5 bg-cyber-charcoal border border-cyber-cyan/30 text-cyber-cyan clip-chamfer group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                <span className="font-display italic text-sm sm:text-base text-cyber-muted tracking-wider uppercase block font-semibold">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
