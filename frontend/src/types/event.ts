export type EventStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'PAUSED';

export interface PrizeCategory {
  title: string;
  amount: string;
  description?: string;
}

export interface EventItem {
  id: string;
  number: string; // e.g. "EVENT_01"
  title: string;
  tagline: string;
  description: string;
  format: string; // e.g. "Take-home project", "In-person live event"
  duration: string; // e.g. "5 Days", "24 Hours"
  startDate: string; // e.g. "September 1, 2026"
  endDate: string; // e.g. "September 6, 2026"
  isoStartDate: string; // ISO date string for countdown/filtering
  prizePool: string; // e.g. "₹3,000"
  prizeAmountNumeric: number; // 3000
  prizes: PrizeCategory[];
  registrationUrl: string;
  rules: string[];
  icon: string; // Icon identifier
  accent?: 'cyan' | 'pink' | 'yellow';
  status: EventStatus;
  isFeatured?: boolean;
  categories?: {
    name: string;
    prizes: PrizeCategory[];
  }[];
}

export interface TimelinePhase {
  phase: string;
  title: string;
  dates: string;
  status: 'upcoming' | 'active' | 'paused' | 'completed';
  description: string;
}

export interface TimelineMilestone {
  date: string;
  title: string;
  eventId?: string;
  description: string;
  isPause?: boolean;
  isHighlight?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
