
import { ReactNode } from 'react';

export type CalendarView = 'day' | 'week' | 'month' | 'year';

export type EventCategory = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export interface EventRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  count?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  description?: string;
  category: EventCategory;
  recurrence?: EventRecurrence;
  attendees?: string[];
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarProps {
  events: CalendarEvent[];
  view: CalendarView;
  date: Date;
  onViewChange: (view: CalendarView) => void;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventCreate: (start: Date, end: Date, allDay?: boolean) => void;
}

export interface EventFormData {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location: string;
  description: string;
  category: EventCategory;
}

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  selectedDate?: Date;
  onSave: (eventData: EventFormData) => void;
  onDelete?: (eventId: string) => void;
}

export interface EventProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

export interface TimeSlotProps {
  time: string;
  events: CalendarEvent[];
  date: Date;
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (start: Date, end: Date) => void;
}

export interface CalendarHeaderProps {
  view: CalendarView;
  date: Date;
  onViewChange: (view: CalendarView) => void;
  onDateChange: (date: Date) => void;
}
