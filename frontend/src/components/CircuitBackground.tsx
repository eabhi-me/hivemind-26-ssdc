import React from 'react';

export const CircuitBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className="w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="circuit-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
            <path
              d="M 10 10 L 50 10 L 80 40 L 150 40 L 170 20 L 190 20 M 30 70 L 70 70 L 100 100 L 140 100 L 160 120 L 190 120 M 10 140 L 40 140 L 70 170 L 130 170 L 150 190 L 190 190"
              fill="none"
              stroke="#00CFFF"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <circle cx="50" cy="10" r="3" fill="#00CFFF" />
            <circle cx="80" cy="40" r="3" fill="#19D8FF" />
            <circle cx="170" cy="20" r="3" fill="#00CFFF" />
            <circle cx="70" cy="70" r="3" fill="#00CFFF" />
            <circle cx="140" cy="100" r="3" fill="#008EAF" />
            <circle cx="70" cy="170" r="3" fill="#00CFFF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
};
