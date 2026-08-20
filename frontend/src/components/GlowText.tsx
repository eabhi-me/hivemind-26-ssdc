import React from 'react';

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
  color?: 'cyan' | 'white' | 'pink' | 'yellow';
}

export const GlowText: React.FC<GlowTextProps> = ({
  children,
  className = '',
  as: Component = 'h2',
  color = 'cyan',
}) => {
  const colorMap = {
    cyan: 'text-cyber-cyan text-glow-cyan',
    white: 'text-cyber-white text-glow-bright',
    pink: 'text-cyber-pink shadow-cyber-pink',
    yellow: 'text-cyber-yellow',
  };

  return (
    <Component className={`font-display italic uppercase tracking-wider ${colorMap[color]} ${className}`}>
      {children}
    </Component>
  );
};
