
import React, { useMemo } from 'react';
import { format, isSameMonth, isToday, startOfMonth, isSameDay } from 'date-fns';
import { getCalendarDays, filterEventsByDay } from '@/utils/dateUtils';
import { CalendarEvent, CalendarView } from '@/types/calendar';
import EventItem from './EventItem';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  onEventClick,
  onDateClick,
}) => {
  const days = useMemo(() => getCalendarDays(date), [date]);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Assign events to days
  const daysWithEvents = useMemo(() => {
    return days.map(day => ({
      ...day,
      events: events.filter(event => isSameDay(day.date, event.start))
    }));
  }, [days, events]);

  return (
    <div className="w-full h-full animate-fade-in">
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div key={day} className="calendar-header-cell">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 auto-rows-fr">
        {daysWithEvents.map((day, index) => (
          <div
            key={index}
            className={cn(
              "calendar-cell",
              day.isToday && "calendar-cell-today",
              !day.isCurrentMonth && "opacity-40"
            )}
            onClick={() => onDateClick(day.date)}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "flex items-center justify-center h-7 w-7 rounded-full text-sm", 
                day.isToday && "bg-primary text-primary-foreground font-medium"
              )}>
                {format(day.date, 'd')}
              </div>
              
              {day.isCurrentMonth && day.date.getDate() === 1 && (
                <span className="text-xs text-muted-foreground font-medium">
                  {format(day.date, 'MMM')}
                </span>
              )}
            </div>
            
            <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
              {day.events.slice(0, 3).map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  onClick={onEventClick}
                />
              ))}
              
              {day.events.length > 3 && (
                <div className="text-xs text-muted-foreground font-medium text-center mt-1 hover:text-primary cursor-pointer">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
