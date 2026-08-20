import React from 'react';

export const GridBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-40" />
      
      {/* Vignette radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,7,0.85)_80%)]" />

      {/* Moving scanline */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent animate-scanline opacity-30" />
    </div>
  );
};
