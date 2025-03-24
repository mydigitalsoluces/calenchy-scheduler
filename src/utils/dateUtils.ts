
import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isSameDay, isSameMonth, isToday, parse, parseISO, setHours, setMinutes, startOfDay, startOfMonth, startOfToday, startOfWeek, subMonths } from 'date-fns';
import { CalendarDay, CalendarEvent } from '@/types/calendar';

export const getCalendarDays = (date: Date): CalendarDay[] => {
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);

  const days = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (day): CalendarDay => ({
      date: day,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
      events: []
    })
  );

  return days;
};

export const formatDate = (date: Date, formatStr: string = 'PPP'): string => {
  return format(date, formatStr);
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const getMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const getWeekDays = (weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): string[] => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn });
  return Array.from({ length: 7 }).map((_, i) => 
    format(addDays(start, i), 'EEEE')
  );
};

export const getWeekDayShort = (weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): string[] => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn });
  return Array.from({ length: 7 }).map((_, i) => 
    format(addDays(start, i), 'E')
  );
};

export const getDayHours = (): string[] => {
  return Array.from({ length: 24 }).map((_, i) => 
    format(setHours(startOfToday(), i), 'h:mm a')
  );
};

export const getTimeSlots = (startHour: number = 0, endHour: number = 24, intervalMinutes: number = 60): Date[] => {
  const today = startOfToday();
  const slots: Date[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      slots.push(setMinutes(setHours(today, hour), minute));
    }
  }
  
  return slots;
};

export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
};

export const filterEventsByDay = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => isSameDay(event.start, date));
};

export const getNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

export const getPrevMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

export const parseEventTimes = (dateStr: string, timeStr: string): Date => {
  return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
};

export const groupEventsByDate = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
  const grouped: Record<string, CalendarEvent[]> = {};
  
  events.forEach(event => {
    const dateKey = format(event.start, 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });
  
  return grouped;
};

export const checkEventOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  return (
    (event1.start < event2.end && event1.end > event2.start) ||
    (event2.start < event1.end && event2.end > event1.start)
  );
};

export const calculateEventPosition = (
  event: CalendarEvent,
  events: CalendarEvent[],
  containerWidth: number
): { left: string; width: string } => {
  const overlappingEvents = events.filter(e => checkEventOverlap(event, e));
  const index = overlappingEvents.indexOf(event);
  const count = overlappingEvents.length;
  
  const width = `${containerWidth / count}px`;
  const left = `${(containerWidth / count) * index}px`;
  
  return { left, width };
};
