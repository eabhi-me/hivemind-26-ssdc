import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EventsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </EventsProvider>
  </React.StrictMode>
);
