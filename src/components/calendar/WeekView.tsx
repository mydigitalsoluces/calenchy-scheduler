
import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, startOfDay, addHours, setHours, setMinutes, differenceInMinutes } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import EventItem from './EventItem';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (start: Date, end: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  
  const weekDays = useMemo(() => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return eachDayOfInterval({ start, end });
  }, [date]);

  const getCurrentTimePosition = () => {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const diffMinutes = differenceInMinutes(now, startOfToday);
    return (diffMinutes / (24 * 60)) * 100;
  };

  const getEventPosition = (event: CalendarEvent, dayDate: Date) => {
    if (!isSameDay(event.start, dayDate)) return null;
    
    const dayStart = startOfDay(dayDate);
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
    return now.getHours() === hour && isSameDay(now, date);
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const start = setHours(setMinutes(day, 0), hour);
    const end = addHours(start, 1);
    onTimeSlotClick(start, end);
  };

  const isToday = (day: Date) => isSameDay(day, new Date());

  return (
    <div className="w-full h-[calc(100vh-160px)] overflow-y-auto relative border border-border rounded-lg animate-fade-in">
      <div className="sticky top-0 z-10 grid grid-cols-[80px_repeat(7,1fr)] bg-background border-b border-border">
        <div className="border-r border-border h-12" />
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "h-12 flex flex-col items-center justify-center border-r border-border",
              isToday(day) && "bg-calendar-today"
            )}
          >
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className={cn(
              "text-sm",
              isToday(day) ? "text-primary font-medium" : "text-muted-foreground"
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="relative">
        {hours.map((hour) => (
          <div 
            key={hour} 
            className={cn(
              "grid grid-cols-[80px_repeat(7,1fr)]",
              isCurrentHour(hour) && "bg-calendar-highlight"
            )}
          >
            <div className="border-r border-b border-border h-16 flex items-center justify-center text-xs text-muted-foreground">
              {format(setHours(date, hour), 'h:mm a')}
            </div>
            
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className="border-r border-b border-border h-16 relative"
                onClick={() => handleTimeSlotClick(day, hour)}
              />
            ))}
          </div>
        ))}
        
        {/* Current time indicator */}
        {weekDays.some(day => isSameDay(day, new Date())) && (
          <div 
            className="absolute left-0 w-full border-t border-primary z-10"
            style={{ top: `${getCurrentTimePosition()}%` }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-primary animate-pulse-subtle" />
          </div>
        )}
        
        {/* Events */}
        {weekDays.map((day, dayIndex) => (
          <div 
            key={day.toString()}
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: `${80 + (dayIndex * ((100 - 80/7) / 7))}px`,
              width: `${(100 - 80/7) / 7}%`,
              height: '100%',
            }}
          >
            {events
              .filter(event => isSameDay(event.start, day))
              .map((event) => {
                const position = getEventPosition(event, day);
                if (!position) return null;
                
                return (
                  <div 
                    key={event.id}
                    className="absolute pointer-events-auto mx-1"
                    style={{
                      ...position,
                      width: 'calc(100% - 8px)',
                    }}
                  >
                    <EventItem event={event} onClick={onEventClick} />
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
