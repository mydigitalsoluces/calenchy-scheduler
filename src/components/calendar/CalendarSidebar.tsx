
import React from 'react';
import { CalendarCheck, Plus, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { CalendarEvent } from '@/types/calendar';

interface CalendarSidebarProps {
  date: Date;
  onCreateEvent: () => void;
  upcomingEvents: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  date,
  onCreateEvent,
  upcomingEvents,
  onEventClick
}) => {
  // Calendar categories with colors
  const calendars = [
    { id: '1', name: 'Personal', color: '#4f46e5', checked: true },
    { id: '2', name: 'Work', color: '#10b981', checked: true },
    { id: '3', name: 'Family', color: '#f59e0b', checked: true },
    { id: '4', name: 'Holidays', color: '#ef4444', checked: true },
  ];

  // Format the current month and year
  const formattedDate = formatDate(date, 'MMMM yyyy');

  return (
    <div className="w-64 border-r border-border h-full flex flex-col bg-background animate-slide-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CalendarCheck className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold tracking-tight">Tempo</h2>
          </div>
        </div>
        
        <Button 
          className="w-full justify-start" 
          onClick={onCreateEvent}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">My Calendars</h3>
          <div className="space-y-2">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`calendar-${calendar.id}`} 
                  defaultChecked={calendar.checked}
                  style={{ 
                    borderColor: calendar.color,
                    backgroundColor: calendar.checked ? calendar.color : 'transparent'
                  }}
                />
                <label
                  htmlFor={`calendar-${calendar.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {calendar.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />
      
      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-sm font-medium mb-2">Upcoming Events</h3>
        <ScrollArea className="h-[400px]">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="rounded-lg border border-border p-3 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatDate(event.start, 'EEE, MMM d')}</div>
                  <div className="text-xs text-muted-foreground">{event.location}</div>
                  <div className="mt-2 flex items-center gap-1">
                    <Badge 
                      className={`bg-calendar-event-${event.category} hover:bg-calendar-event-${event.category}/90`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No upcoming events
            </div>
          )}
        </ScrollArea>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
