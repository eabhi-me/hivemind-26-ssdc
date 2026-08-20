import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { OFFICIAL_EVENTS } from '../data/events';
import { SITE_CONFIG } from '../data/config';
import { SectionHeader } from '../components/SectionHeader';
import { SectionDivider } from '../components/SectionDivider';
import { apiService } from '../services/api';
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Send,
  ShieldAlert,
  MessageSquare,
  Users,
  QrCode,
  ExternalLink,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

interface FormDataState {
  name: string;
  emailId: string;
  collegeEmailId: string;
  regNo: string;
  trade: string;
  phoneNumber: string;
  college: string;
  degree: string;
  batchYear: string;
  selectedEvent: string;
}

export const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get('event');
  const { addRegistrationLocally } = useAuth();

  const whatsappGroupUrl = 'https://chat.whatsapp.com/BsDg3RV0N2A6zpeRSfHhwT?s=qt&p=a&ilr=4';
  const googleGroupUrl = 'https://groups.google.com/g/ssdc-sliet';
  const whatsappQrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappGroupUrl)}&color=00cfff&bcolor=0d1117`;

  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    emailId: '',
    collegeEmailId: '',
    regNo: '',
    trade: SITE_CONFIG.trades[0],
    phoneNumber: '',
    college: SITE_CONFIG.defaultCollege,
    degree: SITE_CONFIG.degrees[0],
    batchYear: '2026',
    selectedEvent: eventParam || 'All Events / General Pass',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Registration | HiveMind 2026';
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const generatedId = 'HM26-' + Math.floor(100000 + Math.random() * 900000);

    try {
      // 1. Pre-flight Live Duplicate Check in MongoDB Atlas
      const checkRes = await apiService.checkDuplicate(formData.emailId, formData.phoneNumber, formData.selectedEvent);
      if (checkRes && checkRes.isDuplicate) {
        setIsSubmitting(false);
        setErrorMessage(
          `DUPLICATE REGISTRATION: ${
            checkRes.message ||
            'A participant with this Email ID or Phone Number has already registered for this event.'
          }`
        );
        return;
      }

      // 2. Transmit registration payload strictly to Flask Backend (MongoDB Atlas)
      const payload: Record<string, string> = {
        name: formData.name,
        emailId: formData.emailId,
        collegeEmailId: formData.collegeEmailId,
        regNo: formData.regNo,
        trade: formData.trade,
        phoneNumber: formData.phoneNumber,
        college: formData.college,
        degree: formData.degree,
        batchYear: formData.batchYear,
        selectedEvent: formData.selectedEvent,
        submissionId: generatedId,
        submittedAt: new Date().toISOString(),
      };

      const result = await apiService.registerForEvent(payload);

      if (result && result.success) {
        const regDoc: any = result.registration || {
          submissionId: result.submissionId || generatedId,
          name: formData.name,
          emailId: formData.emailId,
          collegeEmailId: formData.collegeEmailId,
          regNo: formData.regNo,
          trade: formData.trade,
          phoneNumber: formData.phoneNumber,
          college: formData.college,
          degree: formData.degree,
          batchYear: formData.batchYear,
          selectedEvent: formData.selectedEvent,
          registeredAt: new Date().toISOString(),
        };
        addRegistrationLocally(regDoc);
        setIsSubmitting(false);
        setSubmissionSuccess(result.submissionId || generatedId);
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (err: any) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit registration. Please check if Flask backend is running.');
    }
  };

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-cyber-cyan hover:text-cyber-cyan-bright mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO ARENA HOME</span>
        </Link>

        <SectionHeader
          sysLabel="REGISTRATION // MONGODB_ATLAS_NODE"
          title="HIVEMIND 2026 REGISTRATION"
          subtitle="Fill in your participant credentials to register for challenges. Form data is recorded directly to MongoDB Atlas database."
        />

        {/* Registration Form Box */}
        <div className="bg-cyber-charcoal border-2 border-cyber-cyan/50 p-6 sm:p-10 clip-chamfer-lg relative overflow-hidden shadow-[0_0_35px_rgba(0,207,255,0.15)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-cyan/10 blur-2xl pointer-events-none" />

          {submissionSuccess ? (
            /* Success View with WhatsApp Group Link, QR Scanner & Google Group */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-cyber-cyan/20 border-2 border-cyber-cyan clip-chamfer flex items-center justify-center text-cyber-cyan mb-4 shadow-[0_0_30px_rgba(0,207,255,0.5)]">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest uppercase mb-1">
                REGISTRATION CONFIRMED
              </span>

              <h2 className="font-display text-4xl sm:text-5xl font-black italic uppercase text-cyber-white mb-2">
                WELCOME TO THE HIVE
              </h2>

              <p className="text-cyber-muted text-sm max-w-lg mb-6 font-body">
                Your credentials have been logged in the official HiveMind 2026 database (MongoDB Atlas).
              </p>

              <div className="bg-cyber-black border border-cyber-cyan p-3 px-6 clip-chamfer mb-8 font-mono text-center">
                <span className="text-cyber-muted text-[10px] block mb-0.5">YOUR SUBMISSION ID</span>
                <span className="text-cyber-cyan text-2xl font-bold tracking-wider">{submissionSuccess}</span>
              </div>

              {/* COMMUNITY JOIN HUB: WHATSAPP GROUP + QR SCANNER + GOOGLE GROUP */}
              <div className="w-full bg-cyber-black border-2 border-cyber-cyan/60 p-6 clip-chamfer mb-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 blur-xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-4 border-b border-cyber-cyan/20 pb-3">
                  <MessageSquare className="w-5 h-5 text-cyber-cyan" />
                  <h3 className="font-display text-xl font-bold italic uppercase tracking-wider text-cyber-white">
                    ACTION REQUIRED: JOIN OFFICIAL PARTICIPANT COMMUNITIES
                  </h3>
                </div>

                <p className="text-cyber-muted text-xs font-body mb-6">
                  Join the official SSDC WhatsApp Group and Google Group to receive live competition updates, team announcements, schedule alerts, and judge Q&A sessions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* WhatsApp Group & QR Code Card */}
                  <div className="bg-cyber-charcoal border border-cyber-cyan/40 p-5 clip-chamfer flex flex-col items-center text-center relative group hover:border-cyber-cyan transition-all">
                    <div className="flex items-center gap-2 font-mono text-xs text-cyber-cyan font-bold uppercase mb-3">
                      <QrCode className="w-4 h-4" />
                      <span>WHATSAPP GROUP // SCAN OR CLICK</span>
                    </div>

                    {/* QR Code Frame */}
                    <div className="bg-cyber-black p-3 border border-cyber-cyan clip-chamfer mb-4 shadow-[0_0_15px_rgba(0,207,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,207,255,0.4)] transition-all">
                      <img
                        src={whatsappQrApi}
                        alt="WhatsApp Group QR Code"
                        className="w-40 h-40 object-contain rounded"
                      />
                    </div>

                    <p className="text-[11px] font-mono text-cyber-muted mb-4">
                      Scan QR code with phone camera or tap button below to join:
                    </p>

                    <a
                      href={whatsappGroupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-cyber-cyan text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center justify-center gap-2 uppercase text-sm shadow-[0_0_15px_rgba(0,207,255,0.4)]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>[ JOIN WHATSAPP GROUP ]</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Google Group Card */}
                  <div className="bg-cyber-charcoal border border-cyber-cyan/40 p-5 clip-chamfer flex flex-col justify-between h-full text-center hover:border-cyber-cyan transition-all">
                    <div>
                      <div className="flex items-center justify-center gap-2 font-mono text-xs text-cyber-cyan font-bold uppercase mb-3">
                        <Users className="w-4 h-4" />
                        <span>GOOGLE GROUP // ANNOUNCEMENTS</span>
                      </div>

                      <div className="p-4 bg-cyber-black/70 border border-cyber-cyan/20 clip-chamfer mb-4 text-left font-mono text-xs text-cyber-muted space-y-2">
                        <div className="flex items-center gap-2 text-cyber-white font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                          <span>Official SSDC Forum</span>
                        </div>
                        <div className="flex items-center gap-2 text-cyber-white font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                          <span>Important Broadcasts & Resources</span>
                        </div>
                        <div className="flex items-center gap-2 text-cyber-white font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                          <span>Direct Organizers Support</span>
                        </div>
                      </div>

                      <p className="text-[11px] font-mono text-cyber-muted mb-4">
                        Join SSDC Google Group for email notifications & files:
                      </p>
                    </div>

                    <a
                      href={googleGroupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-cyber-black border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black font-display font-bold italic tracking-wider clip-chamfer transition-all flex items-center justify-center gap-2 uppercase text-sm"
                    >
                      <Users className="w-4 h-4" />
                      <span>[ JOIN GOOGLE GROUP ]</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/events"
                  className="px-8 py-3 bg-cyber-cyan text-cyber-black font-display font-bold italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all uppercase"
                >
                  VIEW CHALLENGES
                </Link>

                <button
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setFormData({
                      ...formData,
                      name: '',
                      emailId: '',
                      collegeEmailId: '',
                      regNo: '',
                      phoneNumber: '',
                    });
                  }}
                  className="px-8 py-3 bg-cyber-black border border-cyber-cyan/50 text-cyber-white font-display font-bold italic tracking-wider clip-chamfer hover:border-cyber-cyan transition-all uppercase"
                >
                  REGISTER ANOTHER PARTICIPANT
                </button>
              </div>
            </motion.div>
          ) : (
            /* Registration Input Form */
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {errorMessage && (
                <div className="p-4 bg-cyber-pink/10 border-2 border-cyber-pink clip-chamfer text-cyber-pink text-xs font-mono flex items-start gap-3 animate-shake">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-cyber-pink" />
                  <div>
                    <span className="font-bold block uppercase mb-0.5">VALIDATION WARNING</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Event Selection Dropdown */}
              <div>
                <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2">
                  SELECTED EVENT / PASS <span className="text-cyber-pink">*</span>
                </label>
                <select
                  name="selectedEvent"
                  value={formData.selectedEvent}
                  onChange={handleChange}
                  className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-cyan focus:outline-none"
                  required
                >
                  <option value="All Events / General Pass">ALL EVENTS / GENERAL FESTIVAL PASS</option>
                  {OFFICIAL_EVENTS.map((event) => (
                    <option key={event.id} value={`${event.number} — ${event.title}`}>
                      {event.number} — {event.title} ({event.tagline})
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 1: Name & Registration Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>FULL NAME <span className="text-cyber-pink">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none placeholder:text-cyber-muted/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>REGISTRATION / ROLL NO <span className="text-cyber-pink">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    placeholder="e.g. 24103001"
                    required
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-cyan focus:outline-none placeholder:text-cyber-muted/40"
                  />
                </div>
              </div>

              {/* Row 2: Personal Email & College Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>PERSONAL EMAIL ID <span className="text-cyber-pink">*</span></span>
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    placeholder="name@gmail.com"
                    required
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none placeholder:text-cyber-muted/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>COLLEGE EMAIL ID <span className="text-cyber-pink">*</span></span>
                  </label>
                  <input
                    type="email"
                    name="collegeEmailId"
                    value={formData.collegeEmailId}
                    onChange={handleChange}
                    placeholder="student@sliet.ac.in"
                    required
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none placeholder:text-cyber-muted/40"
                  />
                </div>
              </div>

              {/* Row 3: Phone Number & College Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>PHONE NUMBER <span className="text-cyber-pink">*</span></span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-cyan focus:outline-none placeholder:text-cyber-muted/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>COLLEGE NAME <span className="text-cyber-pink">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="SLIET Longowal"
                    required
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none placeholder:text-cyber-muted/40"
                  />
                </div>
              </div>

              {/* Row 4: Trade, Degree, Batch Year */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>BRANCH / TRADE <span className="text-cyber-pink">*</span></span>
                  </label>
                  <select
                    name="trade"
                    value={formData.trade}
                    onChange={handleChange}
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-cyan focus:outline-none"
                    required
                  >
                    {SITE_CONFIG.trades.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>DEGREE PROGRAM <span className="text-cyber-pink">*</span></span>
                  </label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-cyan focus:outline-none"
                    required
                  >
                    {SITE_CONFIG.degrees.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>BATCH YEAR <span className="text-cyber-pink">*</span></span>
                  </label>
                  <select
                    name="batchYear"
                    value={formData.batchYear}
                    onChange={handleChange}
                    className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-xs focus:border-cyber-cyan focus:outline-none"
                    required
                  >
                    {SITE_CONFIG.batchYears.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-cyber-cyan text-cyber-black font-display font-black text-xl italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all duration-300 shadow-[0_0_20px_rgba(0,207,255,0.5)] flex items-center justify-center gap-3 uppercase disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>SAVING TO MONGODB ATLAS...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>[ CONFIRM & SUBMIT REGISTRATION ]</span>
                    </>
                  )}
                </button>
                <p className="text-center font-mono text-[10px] text-cyber-muted mt-3">
                  STRICT MONGODB ATLAS REST API BACKEND INTEGRATION
                </p>
              </div>

            </form>
          )}

        </div>

        <SectionDivider label="END OF REGISTRATION NODE" />
      </div>
    </div>
  );
};
