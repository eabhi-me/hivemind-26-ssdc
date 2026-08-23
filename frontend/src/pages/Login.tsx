import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SectionHeader } from '../components/SectionHeader';
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Loader2,
  AlertCircle,
  ArrowLeft,
  LogIn,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { loginWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<'participant' | 'admin'>(
    tabParam === 'admin' ? 'admin' : 'participant'
  );

  // Participant Login State
  const [email, setEmail] = useState('');
  const [submissionKey, setSubmissionKey] = useState('');

  // Admin Login State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Login Portal | HiveMind 2026';
    window.scrollTo(0, 0);

    // Auto-redirect if already logged in
    const token = localStorage.getItem('hivemind_jwt_token');
    const storedUser = localStorage.getItem('hivemind_user');
    if (token || storedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Participant Login Handler
  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await apiService.participantLogin(email, submissionKey);
      if (res.token && res.user) {
        await loginWithGoogle(res.token, res.user);
        if (res.registrations) {
          localStorage.setItem('hivemind_local_regs', JSON.stringify(res.registrations));
        }
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your registered email or Roll No.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Login Handler
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await apiService.adminLogin(adminUsername, adminPassword);
      if (res.token) {
        localStorage.setItem('hivemind_jwt_token', res.token);
        localStorage.setItem('hivemind_user', JSON.stringify({ email: adminUsername, name: 'SSDC Admin', role: 'admin' }));
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid admin username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-cyber-cyan hover:text-cyber-cyan-bright mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO ARENA HOME</span>
        </Link>

        <SectionHeader
          sysLabel="AUTHENTICATION // GATEWAY"
          title="HIVEMIND LOGIN PORTAL"
          subtitle="Log in as a participant to view your registered events or sign in as SSDC Admin to manage entries & publish results."
        />

        {/* Tab Selection Bar */}
        <div className="flex border-b-2 border-cyber-cyan/30 mb-8 bg-cyber-charcoal p-1 clip-chamfer">
          <button
            onClick={() => { setActiveTab('participant'); setErrorMessage(null); }}
            className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all clip-chamfer ${activeTab === 'participant'
              ? 'bg-cyber-cyan text-cyber-black shadow-[0_0_15px_rgba(0,207,255,0.4)]'
              : 'text-cyber-muted hover:text-cyber-white'
              }`}
          >
            <User className="w-4 h-4" />
            <span>PARTICIPANT LOGIN</span>
          </button>

          <button
            onClick={() => { setActiveTab('admin'); setErrorMessage(null); }}
            className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all clip-chamfer ${activeTab === 'admin'
              ? 'bg-cyber-cyan text-cyber-black shadow-[0_0_15px_rgba(0,207,255,0.4)]'
              : 'text-cyber-muted hover:text-cyber-white'
              }`}
          >
            <Shield className="w-4 h-4" />
            <span>ORGANIZER ADMIN</span>
          </button>
        </div>

        {/* Login Box */}
        <div className="bg-cyber-charcoal border-2 border-cyber-cyan/50 p-6 sm:p-8 clip-chamfer-lg relative overflow-hidden shadow-[0_0_35px_rgba(0,207,255,0.15)]">

          {errorMessage && (
            <div className="p-4 bg-cyber-pink/10 border-2 border-cyber-pink clip-chamfer text-cyber-pink text-xs font-mono flex items-start gap-3 mb-6 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-cyber-pink" />
              <div>
                <span className="font-bold block uppercase mb-0.5">AUTHENTICATION ERROR</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {activeTab === 'participant' ? (
            /* PARTICIPANT LOGIN FORM */
            <form onSubmit={handleParticipantSubmit} className="space-y-6">
              <div>
                <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>REGISTERED EMAIL ID OR PHONE NO <span className="text-cyber-pink">*</span></span>
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com or 9876543210"
                  required
                  className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-body text-sm focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>SUBMISSION ID OR ROLL NO <span className="text-cyber-pink">*</span></span>
                </label>
                <input
                  type="text"
                  value={submissionKey}
                  onChange={(e) => setSubmissionKey(e.target.value)}
                  placeholder="e.g. HM26-805458 or 24103001"
                  required
                  className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-cyber-cyan text-cyber-black font-display font-black text-xl italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50 shadow-[0_0_20px_rgba(0,207,255,0.5)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AUTHENTICATING CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>[ ACCESS PARTICIPANT DASHBOARD ]</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div>
                <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>ADMIN USERNAME <span className="text-cyber-pink">*</span></span>
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin@ssdc.sliet"
                  required
                  className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-cyber-cyan uppercase mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>ADMIN PASSWORD <span className="text-cyber-pink">*</span></span>
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-cyber-black border border-cyber-cyan/40 text-cyber-white p-3 clip-chamfer font-mono text-sm focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-cyber-cyan text-cyber-black font-display font-black text-xl italic tracking-wider clip-chamfer hover:bg-cyber-cyan-bright transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50 shadow-[0_0_20px_rgba(0,207,255,0.5)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>VERIFYING ADMIN CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>[ ACCESS ADMIN PORTAL ]</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
