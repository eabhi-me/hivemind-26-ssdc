import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  sysLabel: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sysLabel,
  title,
  subtitle,
  align = 'center',
}) => {
  const alignClasses = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col mb-12 relative z-10 ${alignClasses}`}
    >
      <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs tracking-widest uppercase">
        <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping" />
        {sysLabel}
      </div>
      
      <h2 className="text-4xl md:text-6xl font-display font-extrabold italic uppercase tracking-wider text-cyber-white leading-none">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-cyber-muted text-base md:text-lg max-w-2xl font-body">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
