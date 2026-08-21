import React, { useEffect } from 'react';
import { Organizers } from '../components/Organizers';

export const OrganizersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Event Organizers & Team | HiveMind 2026';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen">
      <Organizers />
    </div>
  );
};
