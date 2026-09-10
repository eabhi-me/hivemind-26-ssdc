import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Terminal, ChevronRight, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLoggedIn = Boolean(user || localStorage.getItem('hivemind_jwt_token'));

  const storedUserStr = localStorage.getItem('hivemind_user');
  let isAdmin = false;
  if (user?.role === 'admin') {
    isAdmin = true;
  } else if (storedUserStr) {
    try {
      const parsed = JSON.parse(storedUserStr);
      if (parsed.role === 'admin') isAdmin = true;
    } catch (e) {}
  }

  const dashboardPath = isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isAdmin ? 'ADMIN PORTAL' : 'DASHBOARD';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HIVEMIND 2026', path: '/#hero', isHash: true, isHighlighted: false },
    { name: 'EVENTS', path: '/events', isHash: false, isHighlighted: false },
    { name: 'WINNERS', path: '/winners', isHash: false, isHighlighted: true },
    { name: 'TIMELINE', path: '/#timeline', isHash: true, isHighlighted: false },
    { name: 'ORGANIZERS', path: '/organizers', isHash: false, isHighlighted: false },
    { name: 'PRIZES', path: '/#prizes', isHash: true, isHighlighted: false },
    ...(isLoggedIn
      ? [{ name: dashboardLabel, path: dashboardPath, isHash: false, isHighlighted: false }]
      : [
          { name: 'DASHBOARD', path: '/dashboard', isHash: false, isHighlighted: false },
          { name: 'LOGIN', path: '/login', isHash: false, isHighlighted: false },
        ]),
  ];

  const handleNavClick = (path: string, isHash: boolean) => {
    setIsMobileMenuOpen(false);
    if (isHash && location.pathname === '/') {
      const element = document.querySelector(path.replace('/', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cyber-black/90 backdrop-blur-md border-b border-cyber-cyan/30 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-cyber-charcoal border border-cyber-cyan/60 clip-chamfer flex items-center justify-center group-hover:border-cyber-cyan group-hover:shadow-[0_0_15px_rgba(0,207,255,0.5)] transition-all duration-300">
            <Terminal className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="font-display text-xl font-bold italic tracking-wider text-cyber-white group-hover:text-cyber-cyan transition-colors leading-none">
              SSDC <span className="text-cyber-cyan">HIVEMIND</span>
            </div>
            <div className="font-mono text-[10px] tracking-widest text-cyber-muted">
              SLIET // 2026
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <React.Fragment key={link.name}>
              {link.isHash && location.pathname === '/' ? (
                <a
                  href={link.path.replace('/', '')}
                  onClick={() => handleNavClick(link.path, true)}
                  className="font-display italic text-sm tracking-wider text-cyber-muted hover:text-cyber-cyan transition-colors relative py-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyber-cyan group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-display italic text-sm tracking-wider transition-all relative py-1 group ${
                      link.isHighlighted
                        ? 'text-cyber-yellow font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] hover:drop-shadow-[0_0_12px_rgba(255,215,0,1)]'
                        : location.pathname.startsWith(link.path) && link.path !== '/'
                        ? 'text-cyber-cyan font-bold'
                        : 'text-cyber-muted hover:text-cyber-cyan'
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                        link.isHighlighted ? 'bg-cyber-yellow' : 'bg-cyber-cyan'
                      } ${
                        location.pathname.startsWith(link.path) && link.path !== '/' ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Join CTA / Logout Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                to={dashboardPath}
                className="px-4 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-black border border-cyber-cyan font-mono text-xs font-bold clip-chamfer transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'ADMIN CONTROL' : 'MY DASHBOARD'}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-cyber-charcoal border border-cyber-pink/50 text-cyber-pink font-mono text-xs clip-chamfer hover:bg-cyber-pink hover:text-cyber-black transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
            </div>
          ) : (
            <Link
              to="/register"
              className="px-5 py-2.5 bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-black border border-cyber-cyan font-mono text-xs font-bold tracking-widest clip-chamfer transition-all duration-300 shadow-[0_0_10px_rgba(0,207,255,0.2)] hover:shadow-[0_0_20px_rgba(0,207,255,0.6)] flex items-center gap-2"
            >
              [ REGISTER NOW ]
            </Link>
          )}
        </div>

        {/* Mobile Controls (Profile + Toggle) */}
        <div className="flex md:hidden items-center gap-3">
          {isLoggedIn && (
            <Link
              to={dashboardPath}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-cyber-cyan border border-cyber-cyan/40 bg-cyber-charcoal clip-chamfer focus:outline-none"
              aria-label="Dashboard"
            >
              <UserCheck className="w-6 h-6" />
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-cyber-cyan border border-cyber-cyan/40 bg-cyber-charcoal clip-chamfer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cyber-black/95 border-b border-cyber-cyan/30 px-6 pt-4 pb-6 space-y-4 backdrop-blur-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.isHash && location.pathname === '/' ? (
                  <a
                    href={link.path.replace('/', '')}
                    onClick={() => handleNavClick(link.path, true)}
                    className="font-display italic text-lg tracking-wider text-cyber-white hover:text-cyber-cyan flex items-center justify-between py-2 border-b border-cyber-charcoal-light"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-cyber-cyan" />
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-display italic text-lg tracking-wider flex items-center justify-between py-2 border-b border-cyber-charcoal-light ${
                      link.isHighlighted 
                        ? 'text-cyber-yellow font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]' 
                        : 'text-cyber-white hover:text-cyber-cyan'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${link.isHighlighted ? 'text-cyber-yellow' : 'text-cyber-cyan'}`} />
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="pt-2">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  to={dashboardPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-cyber-cyan text-cyber-black font-mono text-xs font-bold tracking-widest clip-chamfer block uppercase"
                >
                  [ {isAdmin ? 'ADMIN CONTROL' : 'MY DASHBOARD'} ]
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-3 bg-cyber-charcoal border border-cyber-pink/50 text-cyber-pink font-mono text-xs font-bold tracking-widest clip-chamfer block uppercase"
                >
                  [ LOGOUT ]
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-cyber-cyan text-cyber-black font-mono text-xs font-bold tracking-widest clip-chamfer block uppercase shadow-[0_0_15px_rgba(0,207,255,0.4)]"
              >
                [ REGISTER NOW ]
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
