
import React, { useState } from 'react';
import { addDays, addMonths, addWeeks, format, isBefore, isSameDay, setHours, setMinutes, startOfToday } from 'date-fns';
import { CalendarEvent, CalendarView, EventFormData } from '@/types/calendar';
import { useCalendar } from '@/context/CalendarContext';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import YearView from './YearView';
import EventModal from './EventModal';
import CalendarSidebar from './CalendarSidebar';
import { Badge } from '@/components/ui/badge';
import { filterEventsByDay, sortEventsByTime } from '@/utils/dateUtils';
import { AnimatePresence, motion } from 'framer-motion';

const CalendarApp: React.FC = () => {
  const { 
    events, 
    currentDate, 
    currentView, 
    selectedEvent, 
    setSelectedEvent,
    setCurrentDate, 
    setCurrentView, 
    addEvent,
    updateEvent,
    deleteEvent
  } = useCalendar();
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    if (currentView === 'month') {
      setCurrentDate(date);
      setCurrentView('day');
    } else if (currentView === 'year') {
      setCurrentDate(date);
      setCurrentView('month');
    } else {
      const now = new Date();
      const timeSlot = new Date(date);
      timeSlot.setHours(now.getHours());
      timeSlot.setMinutes(0);
      
      setSelectedTimeSlot(timeSlot);
      setIsEventModalOpen(true);
    }
  };

  const handleTimeSlotClick = (start: Date, end: Date) => {
    setSelectedTimeSlot(start);
    setIsEventModalOpen(true);
  };

  const handleEventSave = (eventData: EventFormData) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setSelectedEvent(null);
  };

  const handleEventDelete = (id: string) => {
    deleteEvent(id);
    setSelectedEvent(null);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
    setSelectedTimeSlot(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'day':
        return (
          <DayView
            date={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'week':
        return (
          <WeekView
            date={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'month':
        return (
          <MonthView
            date={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
        );
      case 'year':
        return (
          <YearView
            date={currentDate}
            events={events}
            onMonthClick={handleDateClick}
          />
        );
      default:
        return null;
    }
  };

  // Get upcoming events (from today onwards, sorted by date)
  const upcomingEvents = events
    .filter(event => isSameDay(event.start, new Date()) || isBefore(new Date(), event.start))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden">
      <CalendarSidebar 
        date={currentDate}
        onCreateEvent={() => setIsEventModalOpen(true)}
        upcomingEvents={upcomingEvents}
        onEventClick={handleEventClick}
      />
      
      <div className="flex-1 p-6 overflow-hidden flex flex-col h-full">
        <CalendarHeader
          view={currentView}
          date={currentDate}
          onViewChange={setCurrentView}
          onDateChange={setCurrentDate}
        />
        
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      </div>
      
      <EventModal
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        event={selectedEvent || undefined}
        selectedDate={selectedTimeSlot || undefined}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />
    </div>
  );
};

export default CalendarApp;
