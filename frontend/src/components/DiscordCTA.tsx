import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Bell, HelpCircle, Mail } from 'lucide-react';

export const DiscordCTA: React.FC = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-cyber-charcoal via-cyber-charcoal-light to-cyber-charcoal border-2 border-cyber-cyan p-8 md:p-14 clip-chamfer-lg relative overflow-hidden shadow-[0_0_50px_rgba(0,207,255,0.3)] text-center flex flex-col items-center"
        >
          {/* Cyan Glow Overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyber-cyan/15 blur-3xl pointer-events-none" />

          <div className="p-3 bg-cyber-black border border-cyber-cyan/40 clip-chamfer text-cyber-cyan mb-6">
            <Users className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black italic tracking-tight uppercase text-cyber-white leading-none mb-4">
            DON'T JUST WATCH THE HIVE. <br />
            <span className="text-cyber-cyan text-glow-bright">JOIN THE COMMUNITY.</span>
          </h2>

          <p className="text-cyber-muted text-base sm:text-lg max-w-xl font-body mb-8">
            Get instant announcements, prompt drops, ask questions, form teams, and meet student participants on the official SSDC Google Group platform.
          </p>

          {/* Quick Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl font-mono text-xs text-cyber-cyan">
            <div className="p-3 bg-cyber-black/70 border border-cyber-cyan/30 clip-chamfer flex items-center justify-center gap-2">
              <Bell className="w-4 h-4" />
              <span>LIVE ANNOUNCEMENTS</span>
            </div>
            <div className="p-3 bg-cyber-black/70 border border-cyber-cyan/30 clip-chamfer flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>COMMUNITY HELPDESK</span>
            </div>
            <div className="p-3 bg-cyber-black/70 border border-cyber-cyan/30 clip-chamfer flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>FORUM DISCUSSIONS</span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="https://groups.google.com/g/ssdc-sliet"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-cyber-cyan text-cyber-black font-display font-black text-xl italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all duration-300 shadow-[0_0_25px_rgba(0,207,255,0.6)] hover:shadow-[0_0_40px_rgba(0,207,255,0.9)] flex items-center gap-3 uppercase group"
          >
            <span>[ JOIN GOOGLE GROUP ]</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>

          <span className="mt-4 font-mono text-xs text-cyber-muted tracking-widest">
            OFFICIAL GROUP // groups.google.com/g/ssdc-sliet
          </span>
        </motion.div>
      </div>
    </section>
  );
};
