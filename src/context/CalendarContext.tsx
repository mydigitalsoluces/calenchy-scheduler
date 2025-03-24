
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CalendarEvent, CalendarView, EventCategory, EventFormData } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, parseISO, startOfMonth } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface CalendarContextType {
  events: CalendarEvent[];
  currentDate: Date;
  currentView: CalendarView;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: CalendarView) => void;
  addEvent: (eventData: EventFormData) => void;
  updateEvent: (id: string, eventData: EventFormData) => void;
  deleteEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const mockEvents: CalendarEvent[] = [
  {
    id: uuidv4(),
    title: 'Team Meeting',
    start: new Date(),
    end: addDays(new Date(), 1),
    category: 'primary',
    description: 'Weekly team sync',
    location: 'Conference Room A'
  },
  {
    id: uuidv4(),
    title: 'Product Launch',
    start: addDays(new Date(), 2),
    end: addDays(new Date(), 2),
    category: 'success',
    description: 'New product line release',
    location: 'Main Auditorium'
  },
  {
    id: uuidv4(),
    title: 'Client Presentation',
    start: addDays(new Date(), 4),
    end: addDays(new Date(), 4),
    category: 'warning',
    description: 'Quarterly results',
    location: 'Client Office'
  },
  {
    id: uuidv4(),
    title: 'Design Review',
    start: addDays(new Date(), -1),
    end: addDays(new Date(), -1),
    category: 'secondary',
    description: 'UI/UX updates',
    location: 'Design Lab'
  },
  {
    id: uuidv4(),
    title: 'Code Sprint',
    start: addDays(new Date(), 7),
    end: addDays(new Date(), 8),
    category: 'info',
    description: 'Feature development',
    location: 'Engineering Wing'
  }
];

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const addEvent = (eventData: EventFormData) => {
    const newEvent: CalendarEvent = {
      id: uuidv4(),
      ...eventData,
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    toast({
      title: "Event Created",
      description: `${eventData.title} has been added to your calendar`,
    });
  };

  const updateEvent = (id: string, eventData: EventFormData) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id 
          ? { ...event, ...eventData } 
          : event
      )
    );
    toast({
      title: "Event Updated",
      description: `${eventData.title} has been updated`,
    });
  };

  const deleteEvent = (id: string) => {
    const eventToDelete = events.find(e => e.id === id);
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    
    if (eventToDelete) {
      toast({
        title: "Event Deleted",
        description: `${eventToDelete.title} has been removed from your calendar`,
        variant: "destructive",
      });
    }
  };

  const value = {
    events,
    currentDate,
    currentView,
    selectedEvent,
    setSelectedEvent,
    setCurrentDate,
    setCurrentView,
    addEvent,
    updateEvent,
    deleteEvent,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
