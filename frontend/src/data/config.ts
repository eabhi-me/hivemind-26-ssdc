export const SITE_CONFIG = {
  // Flask REST API Backend URL
  flaskBackendUrl:
    ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FLASK_BACKEND_URL) ||
    'http://localhost:5000',

  // Google Apps Script Fallback Web App Endpoint URL
  googleScriptUrl:
    ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_SCRIPT_URL) ||
    'https://script.google.com/macros/s/AKfycbwo2dyWp_c9Bh7G6vsEcz9pqhqV51qPO5vis3WtTLQ6TSfT2YyBSpnR3JRAat8qJtB4/exec',

  defaultCollege: 'Sant Longowal Institute of Engineering & Technology (SLIET)',

  trades: [
    'Computer Science & Engineering (CSE)',
    'Electronics & Communication Engineering (ECE)',
    'Electrical Engineering (EE)',
    'Mechanical Engineering (ME)',
    'Information Technology (IT)',
    'Chemical Engineering (CHE)',
    'Food Engineering & Technology (FET)',
    'Instrumentation & Control (ICE)',
    'Other / General',
  ],

  degrees: [
    'B.Tech/B.E',
    'Diploma',
    'M.Tech',
    'M.Sc/B.Sc',
    'Ph.D',
    'Other',
  ],

  batchYears: ['2022', '2023', '2024', '2025', '2026', '2027'],
};
