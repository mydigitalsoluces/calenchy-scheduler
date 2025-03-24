
import React, { useMemo } from 'react';
import { format, addHours, setHours, setMinutes, startOfDay, isSameHour, isBefore, isAfter, differenceInMinutes } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import EventItem from './EventItem';
import { cn } from '@/lib/utils';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (start: Date, end: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const hours = useMemo(() => 
    Array.from({ length: 24 }, (_, i) => i), 
  []);

  // Filter events for this day
  const dayEvents = useMemo(() => 
    events.filter(event => 
      format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ),
  [events, date]);

  const getCurrentTimePosition = () => {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const diffMinutes = differenceInMinutes(now, startOfToday);
    return (diffMinutes / (24 * 60)) * 100;
  };

  const getEventPosition = (event: CalendarEvent) => {
    const dayStart = startOfDay(date);
    const startMinutes = differenceInMinutes(event.start, dayStart);
    const endMinutes = differenceInMinutes(event.end, dayStart);
    const startPercent = (startMinutes / (24 * 60)) * 100;
    const durationPercent = ((endMinutes - startMinutes) / (24 * 60)) * 100;
    
    return {
      top: `${startPercent}%`,
      height: `${durationPercent}%`,
    };
  };

  const isCurrentHour = (hour: number) => {
    const now = new Date();
    return now.getHours() === hour && format(now, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
  };

  const handleTimeSlotClick = (hour: number) => {
    const start = setHours(setMinutes(date, 0), hour);
    const end = addHours(start, 1);
    onTimeSlotClick(start, end);
  };

  return (
    <div className="w-full h-[calc(100vh-160px)] overflow-y-auto relative border border-border rounded-lg animate-fade-in">
      <div className="sticky top-0 z-10 grid grid-cols-[80px_1fr] bg-background border-b border-border">
        <div className="border-r border-border h-12 flex items-center justify-center text-sm font-medium text-muted-foreground">
          Time
        </div>
        <div className="h-12 flex items-center justify-center text-sm font-medium">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
      
      <div className="grid grid-cols-[80px_1fr]">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="border-r border-border h-16 flex items-center justify-center text-xs text-muted-foreground">
              {format(setHours(date, hour), 'h:mm a')}
            </div>
            <div 
              className={cn(
                "border-b border-border h-16 relative",
                isCurrentHour(hour) && "bg-calendar-highlight"
              )}
              onClick={() => handleTimeSlotClick(hour)}
            />
          </React.Fragment>
        ))}
        
        {/* Current time indicator */}
        {format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
          <div 
            className="absolute left-0 w-full border-t border-primary z-10"
            style={{ top: `${getCurrentTimePosition()}%` }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-primary animate-pulse-subtle" />
          </div>
        )}
        
        {/* Events */}
        <div className="absolute top-12 left-[80px] right-0 bottom-0 pointer-events-none">
          {dayEvents.map((event) => (
            <div 
              key={event.id}
              className="absolute pointer-events-auto mx-2"
              style={{
                ...getEventPosition(event),
                width: 'calc(100% - 16px)',
              }}
            >
              <EventItem event={event} onClick={onEventClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
