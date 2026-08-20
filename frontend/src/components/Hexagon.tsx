import React from 'react';

interface HexagonProps {
  size?: number;
  className?: string;
  glow?: boolean;
  active?: boolean;
  children?: React.ReactNode;
}

export const Hexagon: React.FC<HexagonProps> = ({
  size = 100,
  className = '',
  glow = false,
  active = false,
  children,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full transition-all duration-300 ${
          glow ? 'filter drop-shadow-[0_0_12px_rgba(0,207,255,0.6)]' : ''
        }`}
      >
        <polygon
          points="50,3 93,25 93,75 50,97 7,75 7,25"
          className={`transition-all duration-300 ${
            active
              ? 'fill-cyber-charcoal-light stroke-cyber-cyan stroke-[2.5]'
              : 'fill-cyber-charcoal/80 stroke-cyber-cyan/40 stroke-[1.5] hover:stroke-cyber-cyan hover:fill-cyber-charcoal-light'
          }`}
        />
        {/* Inner geometric accent lines */}
        <polygon
          points="50,12 85,30 85,70 50,88 15,70 15,30"
          className="fill-none stroke-cyber-cyan/15 stroke-[1]"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
          {children}
        </div>
      )}
    </div>
  );
};
