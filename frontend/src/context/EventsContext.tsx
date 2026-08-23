import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { OFFICIAL_EVENTS } from '../data/events';
import { EventItem } from '../types/event';

interface EventsContextType {
  events: EventItem[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    const cached = localStorage.getItem('hivemind_events');
    if (cached) {
      try {
        const parsedCached = JSON.parse(cached);
        return OFFICIAL_EVENTS.map(staticEvent => {
          const cacheEvent = parsedCached.find((e: any) => e.id === staticEvent.id);
          return cacheEvent ? { ...staticEvent, ...cacheEvent } : staticEvent;
        });
      } catch (e) {
        return OFFICIAL_EVENTS;
      }
    }
    return OFFICIAL_EVENTS;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const refreshEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents();
      const liveEvents = response.events;
      if (liveEvents && liveEvents.length > 0) {
        const mergedEvents = OFFICIAL_EVENTS.map(staticEvent => {
          const liveEvent = liveEvents.find((e: any) => e.id === staticEvent.id);
          return liveEvent ? { ...staticEvent, ...liveEvent } : staticEvent;
        });
        setEvents(mergedEvents);
        localStorage.setItem('hivemind_events', JSON.stringify(mergedEvents));
      }
    } catch (err) {
      console.error('Failed to load live events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading, refreshEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
