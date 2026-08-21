import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { SectionDivider } from './SectionDivider';
import {
  Code,
  Github,
  Linkedin,
  Mail,
  Shield,
  Terminal,
  Award,
  Users,
  ExternalLink,
  Cpu,
  Building,
} from 'lucide-react';

export interface OrganizerMember {
  id: string;
  name: string;
  role: string;
  title: string;
  category: 'FACULTY' | 'MENTOR' | 'STUDENT_LEAD';
  specialty: string;
  assignedEvent: string;
  image?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  emailUrl?: string;
}

export const FACULTY_MENTORS: OrganizerMember[] = [];

export const STUDENT_ORGANIZERS: OrganizerMember[] = [];

export const Organizers: React.FC = () => {
  return (
    <section id="organizers" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          sysLabel="SSDC_CREW // CREATORS_AND_LEADS"
          title="FESTIVAL ORGANIZERS & TEAM"
          subtitle="Powered by the Software Development Club (SSDC), Department of Computer Science & Engineering, SLIET Longowal."
        />

        {/* ABOUT SSDC CLUB HIGHLIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-cyber-charcoal border-2 border-cyber-cyan p-6 sm:p-10 clip-chamfer-lg mb-16 relative overflow-hidden shadow-[0_0_35px_rgba(0,207,255,0.15)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* SSDC Club Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyber-cyan text-cyber-black clip-chamfer flex items-center justify-center font-bold">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest uppercase block">
                    FOUNDED IN 2017 // CSE DEPARTMENT
                  </span>
                  <h3 className="font-display text-3xl font-extrabold italic uppercase text-cyber-white">
                    SOFTWARE DEVELOPMENT CLUB (SSDC)
                  </h3>
                </div>
              </div>

              <p className="font-body text-sm text-cyber-muted leading-relaxed">
                SSDC is the premier student-led technical organization under the Department of Computer Science & Engineering at Sant Longowal Institute of Engineering & Technology (SLIET). We nurture a vibrant ecosystem of 40+ active developers, open-source contributors, competitive programmers, and cybersecurity enthusiasts.
              </p>

              {/* Club Badges */}
              <div className="flex flex-wrap gap-3 font-mono text-xs">
                <span className="px-3 py-1 bg-cyber-black border border-cyber-cyan/40 text-cyber-cyan clip-chamfer flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>40+ Active Developers</span>
                </span>
                <span className="px-3 py-1 bg-cyber-black border border-cyber-yellow/40 text-cyber-yellow clip-chamfer flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>₹20,000 Prize Pool</span>
                </span>
                <span className="px-3 py-1 bg-cyber-black border border-cyber-pink/40 text-cyber-pink clip-chamfer flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>SLIET Longowal</span>
                </span>
              </div>
            </div>

            {/* SSDC Links & CTA */}
            <div className="bg-cyber-black border border-cyber-cyan/40 p-6 clip-chamfer text-center space-y-4 shadow-[0_0_20px_rgba(0,207,255,0.1)]">
              <span className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-widest block">
                OFFICIAL COMMUNITY LINKS
              </span>

              <div className="flex flex-col gap-2">
                <a
                  href="https://chat.whatsapp.com/BsDg3RV0N2A6zpeRSfHhwT?s=qt&p=a&ilr=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-cyber-cyan text-cyber-black font-display font-bold italic text-xs clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center justify-center gap-2 uppercase"
                >
                  <Users className="w-4 h-4" />
                  <span>WHATSAPP COMMUNITY</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://github.com/SSDC-SLIET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-cyber-charcoal border border-cyber-cyan/50 text-cyber-white font-mono text-xs clip-chamfer hover:border-cyber-cyan transition-all flex items-center justify-center gap-2 uppercase"
                >
                  <Github className="w-4 h-4 text-cyber-cyan" />
                  <span>GITHUB ORGANISATION</span>
                </a>

                <a
                  href="https://www.linkedin.com/company/sliet-software-developement-club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-cyber-charcoal border border-cyber-cyan/50 text-cyber-white font-mono text-xs clip-chamfer hover:border-cyber-cyan transition-all flex items-center justify-center gap-2 uppercase"
                >
                  <Linkedin className="w-4 h-4 text-cyber-cyan" />
                  <span>LINKEDIN PAGE</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>

        {/* FACULTY ADVISORS & MENTORS GRID */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-cyber-yellow" />
            <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white">
              FACULTY ADVISORS & MENTORS
            </h3>
          </div>

          {FACULTY_MENTORS.length === 0 ? (
            <div className="bg-cyber-charcoal border-2 border-cyber-yellow/40 p-8 clip-chamfer text-center relative overflow-hidden">
              <span className="font-mono text-xs font-bold text-cyber-yellow uppercase tracking-widest block mb-2">
                ROSTER UPDATE PENDING
              </span>
              <h4 className="font-display text-2xl font-bold italic uppercase text-cyber-white mb-2">
                FACULTY ADVISORS & MENTOR ROSTER ANNOUNCEMENT COMING SOON
              </h4>
              <p className="font-body text-xs text-cyber-muted max-w-xl mx-auto">
                Official faculty patron & mentor assignments for HiveMind 2026 are being finalized by the department.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FACULTY_MENTORS.map((member) => (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -4 }}
                  className="bg-cyber-charcoal border-2 border-cyber-yellow/40 p-5 clip-chamfer relative overflow-hidden group hover:border-cyber-yellow transition-all shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                >
                  <div className="w-12 h-12 bg-cyber-black border border-cyber-yellow/60 clip-chamfer flex items-center justify-center text-cyber-yellow font-display font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
                    {member.name.charAt(4) || member.name.charAt(0)}
                  </div>

                  <span className="font-mono text-[10px] text-cyber-yellow font-bold uppercase tracking-widest block mb-1">
                    {member.role}
                  </span>

                  <h4 className="font-display text-lg font-bold italic uppercase text-cyber-white mb-1 group-hover:text-cyber-yellow transition-colors">
                    {member.name}
                  </h4>

                  <p className="font-mono text-xs text-cyber-muted mb-3">
                    {member.title}
                  </p>

                  <div className="p-2.5 bg-cyber-black/70 border border-cyber-yellow/20 clip-chamfer font-mono text-[11px] text-cyber-muted space-y-1">
                    <div>
                      <span className="text-cyber-yellow font-bold">SPECIALTY:</span> {member.specialty}
                    </div>
                    <div>
                      <span className="text-cyber-yellow font-bold">RESPONSIBILITY:</span> {member.assignedEvent}
                    </div>
                  </div>

                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-cyber-yellow hover:underline"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>CONNECT ON LINKEDIN</span>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* STUDENT ORGANIZERS & TEAM CREW GRID */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-6 h-6 text-cyber-cyan" />
            <h3 className="font-display text-2xl font-bold italic uppercase tracking-wider text-cyber-white">
              CORE EVENT ORGANIZERS & TEAM LEADS
            </h3>
          </div>

          {STUDENT_ORGANIZERS.length === 0 ? (
            <div className="bg-cyber-charcoal border-2 border-cyber-cyan/40 p-8 clip-chamfer text-center relative overflow-hidden">
              <span className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-widest block mb-2">
                ROSTER UPDATE PENDING
              </span>
              <h4 className="font-display text-2xl font-bold italic uppercase text-cyber-white mb-2">
                STUDENT COORDINATORS & EVENT HEADS ANNOUNCEMENT COMING SOON
              </h4>
              <p className="font-body text-xs text-cyber-muted max-w-xl mx-auto">
                The updated list of student leads and event conveners for HiveMind 2026 will be revealed shorty. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {STUDENT_ORGANIZERS.map((member) => (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -5 }}
                  className="bg-cyber-charcoal border-2 border-cyber-cyan/50 p-6 clip-chamfer relative overflow-hidden group hover:border-cyber-cyan transition-all shadow-[0_0_20px_rgba(0,207,255,0.15)]"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-cyber-cyan/20 pb-3">
                    <div className="w-12 h-12 bg-cyber-cyan text-cyber-black clip-chamfer flex items-center justify-center font-display font-black text-2xl shadow-[0_0_15px_rgba(0,207,255,0.4)]">
                      {member.name.charAt(0)}
                    </div>

                    <span className="font-mono text-[10px] text-cyber-cyan bg-cyber-cyan/10 px-2.5 py-1 border border-cyber-cyan/40 clip-chamfer uppercase font-bold">
                      {member.role}
                    </span>
                  </div>

                  <h4 className="font-display text-2xl font-extrabold italic uppercase text-cyber-white mb-1 group-hover:text-cyber-cyan transition-colors">
                    {member.name}
                  </h4>

                  <p className="font-mono text-xs text-cyber-muted mb-4">
                    {member.title}
                  </p>

                  <div className="p-3 bg-cyber-black/70 border border-cyber-cyan/30 clip-chamfer font-mono text-xs text-cyber-muted space-y-1.5 mb-4">
                    <div>
                      <span className="text-cyber-cyan font-bold block text-[10px]">DOMAIN / TECH STACK</span>
                      <span>{member.specialty}</span>
                    </div>
                    <div>
                      <span className="text-cyber-cyan font-bold block text-[10px]">EVENT RESPONSIBILITY</span>
                      <span className="text-cyber-white">{member.assignedEvent}</span>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center gap-3 pt-2 border-t border-cyber-cyan/20">
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-cyber-black border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black clip-chamfer transition-all"
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}

                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-cyber-black border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black clip-chamfer transition-all"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}

                    {member.emailUrl && (
                      <a
                        href={member.emailUrl}
                        className="p-2 bg-cyber-black border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black clip-chamfer transition-all"
                        title="Contact Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <SectionDivider label="END OF ORGANIZERS NODE" />
      </div>
    </section>
  );
};
