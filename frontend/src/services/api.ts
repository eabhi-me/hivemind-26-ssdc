import { SITE_CONFIG } from '../data/config';

export interface UserProfile {
  email: string;
  name: string;
  role?: string;
  picture?: string;
  college?: string;
  regNo?: string;
  trade?: string;
  phoneNumber?: string;
  degree?: string;
  batchYear?: string;
}

export interface UserRecord {
  _id?: string;
  isBanned?: boolean;
  name: string;
  emailId: string;
  collegeEmailId?: string;
  regNo: string;
  trade: string;
  phoneNumber: string;
  college: string;
  degree: string;
  batchYear: string;
  registeredAt?: string;
}

export interface RegistrationRecord {
  submissionId: string;
  name: string;
  emailId: string;
  collegeEmailId?: string;
  selectedEvent: string;
  phoneNumber: string;
  regNo: string;
  trade: string;
  college: string;
  degree: string;
  batchYear: string;
  status?: string;
  registeredAt: string;
}

export interface EventResultRecord {
  eventId: string;
  eventTitle: string;
  winner1st?: string;
  winner2nd?: string;
  winner3rd?: string;
  specialMentions?: string;
  announcementNotes?: string;
  eventStatus?: string;
  publishedAt?: string;
}

export interface NoticeRecord {
  noticeId: string;
  title: string;
  category: string;
  targetEvent?: string;
  content: string;
  priority?: string;
  publishedAt?: string;
}

class ApiService {
  private baseUrl = SITE_CONFIG.flaskBackendUrl;

  private adminHeaders(): Record<string, string> {
    const token = localStorage.getItem('hivemind_jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Track Page Visit & Render Keep-Alive
  async recordPageVisit() {
    try {
      await fetch(`${this.baseUrl}/api/visit`, {
        method: 'POST',
      });
    } catch (err) {
      // Ignore errors for metrics
    }
  }

  // Admin Metrics
  async getAdminMetrics() {
    const token = localStorage.getItem('hivemind_jwt_token');
    const response = await fetch(`${this.baseUrl}/api/admin/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch metrics');
    return data;
  }



  // 1. Participant Login (Queries HiveMind Cloud Core & returns user + all registered events)
  async participantLogin(email: string, key?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, submissionId: key }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      return data;
    } catch (err: any) {
      // LocalStorage Fallback for offline mode or network error
      const localRegsStr = localStorage.getItem('hivemind_local_regs');
      let localRegs: RegistrationRecord[] = [];
      if (localRegsStr) {
        try { localRegs = JSON.parse(localRegsStr); } catch (e) { }
      }

      const inputLow = email.toLowerCase().trim();
      const matched = localRegs.filter((r) =>
        r.emailId?.toLowerCase().trim() === inputLow ||
        r.collegeEmailId?.toLowerCase().trim() === inputLow ||
        r.submissionId?.toLowerCase().trim() === inputLow ||
        r.regNo?.toLowerCase().trim() === inputLow
      );

      if (matched.length > 0) {
        return {
          success: true,
          token: 'offline_token_' + Date.now(),
          user: { email: matched[0].emailId || inputLow, name: matched[0].name, role: 'participant' },
          registrations: matched,
        };
      }

      throw new Error(err.message || 'Login failed. Could not connect to backend server.');
    }
  }

  // 2. Admin Login
  async adminLogin(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Admin Authentication failed');
    return data;
  }

  // 3. Direct Event Registration (Strict Flask REST API -> Cloud Vault)
  async registerForEvent(payload: Record<string, string>): Promise<{ success: boolean; submissionId: string; message: string; registration?: RegistrationRecord }> {
    const response = await fetch(`${this.baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
  }

  // 4. Pre-flight check for duplicate registrations in Cloud Vault
  async checkDuplicate(emailId: string, phoneNumber: string, selectedEvent?: string, regNo?: string): Promise<{ isDuplicate: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/registrations/check?emailId=${encodeURIComponent(emailId)}&phoneNumber=${encodeURIComponent(phoneNumber)}&selectedEvent=${encodeURIComponent(selectedEvent || '')}&regNo=${encodeURIComponent(regNo || '')}`
      );
      return await response.json();
    } catch (err) {
      return { isDuplicate: false };
    }
  }

  // 5. Admin: Get Filtered Registrations List from Cloud Vault
  async getAdminRegistrations(eventFilter: string = '', searchQuery: string = ''): Promise<{ count: number; registrations: RegistrationRecord[] }> {
    const response = await fetch(
      `${this.baseUrl}/api/admin/registrations?event=${encodeURIComponent(eventFilter)}&search=${encodeURIComponent(searchQuery)}`,
      { headers: this.adminHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch admin registrations');
    return data;
  }

  // 5a. Admin: Get Users List from Cloud Vault
  async getAdminUsers(searchQuery: string = ''): Promise<{ count: number; users: UserRecord[] }> {
    const response = await fetch(
      `${this.baseUrl}/api/admin/users?search=${encodeURIComponent(searchQuery)}`,
      { headers: this.adminHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch admin users');
    return data;
  }

  // 5b. Admin: Delete Participant Registration
  async deleteAdminRegistration(submissionId: string) {
    const response = await fetch(`${this.baseUrl}/api/admin/registrations/${encodeURIComponent(submissionId)}`, {
      method: 'DELETE',
      headers: this.adminHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete registration');
    return data;
  }

  // 5c. Admin: Update Participant Status (BAN / UNBAN)
  async updateAdminRegistrationStatus(submissionId: string, status: string) {
    const response = await fetch(`${this.baseUrl}/api/admin/registrations/${encodeURIComponent(submissionId)}/status`, {
      method: 'PUT',
      headers: this.adminHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update registration status');
    return data;
  }

  async deleteUser(userId: string) {
    try {
      const token = localStorage.getItem('hivemind_jwt_token');
      const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: 'Failed to delete user' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async toggleUserBan(userId: string, isBanned: boolean) {
    try {
      const token = localStorage.getItem('hivemind_jwt_token');
      const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isBanned })
      });
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: 'Failed to update ban status' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // 5d. Public & Participant: Get All Events with Dynamic Schedules
  async getEvents(): Promise<{ count: number; events: any[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/events`);
      return await response.json();
    } catch (err) {
      return { count: 0, events: [] };
    }
  }

  // 5e. Admin: Save / Update Event Details & Schedule
  async saveAdminEvent(eventId: string, payload: any) {
    const response = await fetch(`${this.baseUrl}/api/admin/events/${encodeURIComponent(eventId)}`, {
      method: 'PUT',
      headers: this.adminHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to save event details');
    return data;
  }

  async exportAdminData(format: 'csv' | 'excel', eventFilter: string = '') {
    try {
      const endpoint = format === 'excel' ? '/api/admin/export/excel' : '/api/admin/export';
      const token = localStorage.getItem('hivemind_jwt_token');
      const response = await fetch(`${this.baseUrl}${endpoint}?event=${encodeURIComponent(eventFilter)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const extension = format === 'excel' ? 'xlsx' : 'csv';
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.download = `HiveMind_Registrations_${eventFilter || 'ALL'}_${dateStr}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 7. Admin: Publish Event Results & Winners to Cloud Core
  async publishEventResults(payload: Partial<EventResultRecord>) {
    const response = await fetch(`${this.baseUrl}/api/admin/results`, {
      method: 'POST',
      headers: this.adminHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to publish results');
    return data;
  }

  // 8. Public: Read Published Event Results from Cloud Core
  async getPublishedResults(): Promise<{ count: number; results: EventResultRecord[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/results`);
      return await response.json();
    } catch (err) {
      return { count: 0, results: [] };
    }
  }

  // 9. Admin: Publish Official Notice / Event News
  async publishNotice(payload: Partial<NoticeRecord>) {
    const response = await fetch(`${this.baseUrl}/api/admin/notices`, {
      method: 'POST',
      headers: this.adminHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to publish notice');
    return data;
  }

  // 10. Admin: Delete Notice
  async deleteNotice(noticeId: string) {
    const response = await fetch(`${this.baseUrl}/api/admin/notices/${encodeURIComponent(noticeId)}`, {
      method: 'DELETE',
      headers: this.adminHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete notice');
    return data;
  }

  // 11. Public & Participant: Get All Official Notices
  async getNotices(): Promise<{ count: number; notices: NoticeRecord[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notices`);
      return await response.json();
    } catch (err) {
      return { count: 0, notices: [] };
    }
  }

  // Fetch User Profile & Registrations from Cloud Core
  async fetchUserProfile(_token?: string): Promise<{ user: UserProfile; registrations: RegistrationRecord[] }> {
    try {
      const storedToken = _token || localStorage.getItem('hivemind_jwt_token');
      if (storedToken && storedToken !== 'active_token') {
        const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (response.ok) {
          const res = await response.json();
          return {
            user: res.user || { email: '', name: 'Participant', role: 'participant' },
            registrations: res.registrations || [],
          };
        }
      }

      // Fallback for edge cases where token might not exist but email does locally
      const storedUser = localStorage.getItem('hivemind_user');
      let email = '';
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          email = parsed.email;
        } catch (e) { }
      }
      
      return {
        user: { email, name: 'Participant', role: 'participant' },
        registrations: [],
      };
    } catch (err) { }

    const saved = localStorage.getItem('hivemind_local_regs');
    const regs = saved ? JSON.parse(saved) : [];
    return {
      user: { email: '', name: '' },
      registrations: regs,
    };
  }

  async authenticateGoogle(_credential: string, userFallback?: Partial<UserProfile>) {
    return {
      success: true,
      token: 'dev_token',
      user: {
        email: userFallback?.email || 'user@gmail.com',
        name: userFallback?.name || 'HiveMind Participant',
      },
    };
  }
}

export const apiService = new ApiService();
