import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { FAQ_ITEMS } from '../data/faq';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-cyber-charcoal/40 border-y border-cyber-cyan/20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sysLabel="KNOWLEDGE // FAQ_HELPDESK"
          title="FREQUENTLY ASKED QUESTIONS"
          subtitle="Everything you need to know about participating, registrations, rules, and rewards."
        />

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-cyber-black border clip-chamfer transition-all duration-300 ${
                  isOpen
                    ? 'border-cyber-cyan shadow-[0_0_20px_rgba(0,207,255,0.2)]'
                    : 'border-cyber-cyan/30 hover:border-cyber-cyan/60'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-cyber-cyan shrink-0" />
                    <span className="font-display text-lg md:text-xl font-bold italic uppercase tracking-wider text-cyber-white">
                      {item.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-cyber-cyan transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-cyber-muted text-sm font-body border-t border-cyber-cyan/10 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
