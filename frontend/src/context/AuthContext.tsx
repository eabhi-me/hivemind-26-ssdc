import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, UserProfile, RegistrationRecord } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  registeredEvents: RegistrationRecord[];
  isLoading: boolean;
  loginWithGoogle: (credential: string, userPayload?: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  refreshUserRegistrations: () => Promise<void>;
  addRegistrationLocally: (reg: RegistrationRecord) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('hivemind_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('hivemind_jwt_token');
  });

  const [registeredEvents, setRegisteredEvents] = useState<RegistrationRecord[]>(() => {
    const saved = localStorage.getItem('hivemind_local_regs');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.email || token) {
      refreshUserRegistrations();
    }
  }, [user?.email, token]);

  const loginWithGoogle = async (credential: string, userPayload?: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      if (userPayload && userPayload.email) {
        setUser(userPayload as UserProfile);
        setToken(credential || 'active_token');
        localStorage.setItem('hivemind_jwt_token', credential || 'active_token');
        localStorage.setItem('hivemind_user', JSON.stringify(userPayload));

        const res = await apiService.participantLogin(userPayload.email);
        if (res && res.registrations) {
          setRegisteredEvents(res.registrations);
          localStorage.setItem('hivemind_local_regs', JSON.stringify(res.registrations));
        }
      }
    } catch (err) {
      console.error('Auth login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserRegistrations = async () => {
    const activeEmail = user?.email || (() => {
      const saved = localStorage.getItem('hivemind_user');
      return saved ? JSON.parse(saved).email : '';
    })();

    if (!activeEmail) return;

    try {
      const data = await apiService.fetchUserProfile(token || undefined);
      if (data && data.registrations && data.registrations.length > 0) {
        setRegisteredEvents(data.registrations);
        localStorage.setItem('hivemind_local_regs', JSON.stringify(data.registrations));
      }
      if (data.user && (data.user.email || data.user.role === 'admin')) {
        setUser((prev) => {
          const isSameEmail = data.user.email && prev?.email === data.user.email;
          const isSameAdmin = data.user.role === 'admin' && prev?.role === 'admin';
          if (!prev || (!isSameEmail && !isSameAdmin) || prev.name !== data.user.name) {
            localStorage.setItem('hivemind_user', JSON.stringify(data.user));
            return { ...prev, ...data.user };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Refresh registrations error:', err);
    }
  };

  const addRegistrationLocally = (reg: RegistrationRecord) => {
    setRegisteredEvents((prev) => {
      const updated = [reg, ...prev.filter((r) => r.selectedEvent !== reg.selectedEvent)];
      localStorage.setItem('hivemind_local_regs', JSON.stringify(updated));
      return updated;
    });

    if (reg.emailId && !user) {
      const newUser = { email: reg.emailId, name: reg.name, role: 'participant' };
      setUser(newUser);
      setToken('active_token_' + Date.now());
      localStorage.setItem('hivemind_user', JSON.stringify(newUser));
      localStorage.setItem('hivemind_jwt_token', 'active_token_' + Date.now());
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRegisteredEvents([]);
    localStorage.removeItem('hivemind_jwt_token');
    localStorage.removeItem('hivemind_user');
    localStorage.removeItem('hivemind_local_regs');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        registeredEvents,
        isLoading,
        loginWithGoogle,
        logout,
        refreshUserRegistrations,
        addRegistrationLocally,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
