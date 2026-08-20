import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Node Not Found | HiveMind 2026';
  }, []);

  return (
    <div className="pt-32 pb-24 relative z-10 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="bg-cyber-charcoal border-2 border-cyber-pink p-8 clip-chamfer-lg shadow-[0_0_35px_rgba(255,45,166,0.3)]">
          <div className="w-16 h-16 mx-auto mb-4 bg-cyber-black border border-cyber-pink clip-chamfer flex items-center justify-center text-cyber-pink">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>

          <span className="font-mono text-xs text-cyber-pink font-bold tracking-widest block mb-2">
            ERR // 404_NOT_FOUND
          </span>

          <h1 className="font-display text-6xl font-black italic text-cyber-white tracking-tight uppercase leading-none mb-3">
            NODE VOID
          </h1>

          <p className="text-cyber-muted text-sm font-body mb-6">
            The requested address does not correspond to an active challenge matrix or endpoint in HiveMind 2026.
          </p>

          <div className="p-3 bg-cyber-black font-mono text-[10px] text-cyber-cyan border border-cyber-cyan/30 clip-chamfer mb-6 text-left">
            <div>SYS_DIAGNOSTIC: UNMAPPED_URI</div>
            <div>STATUS: CORRUPTED_ROUTE_POINTER</div>
          </div>

          <Link
            to="/"
            className="w-full py-3.5 bg-cyber-cyan text-cyber-black font-display font-black text-lg italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center justify-center gap-2 uppercase shadow-[0_0_15px_rgba(0,207,255,0.4)]"
          >
            <Home className="w-5 h-5" />
            <span>RETURN TO ARENA BASE</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
