import React from 'react';

interface SectionDividerProps {
  label?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ label = 'SYS // HIVEMIND_2026' }) => {
  return (
    <div className="w-full flex items-center justify-center my-12 relative z-10">
      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-cyber-cyan/30 to-cyber-cyan/60" />
      <div className="mx-4 px-3 py-1 bg-cyber-charcoal border border-cyber-cyan/40 clip-chamfer flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
        <span className="font-mono text-xs tracking-widest text-cyber-cyan font-bold">{label}</span>
      </div>
      <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-cyber-cyan/30 to-cyber-cyan/60" />
    </div>
  );
};
