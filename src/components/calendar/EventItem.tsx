
import React from 'react';
import { EventProps } from '@/types/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';

const EventItem: React.FC<EventProps> = ({ event, onClick }) => {
  const categoryClass = `calendar-event-${event.category}`;

  const formatTimeRange = () => {
    if (event.allDay) {
      return 'All Day';
    }
    return `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`;
  };

  return (
    <div 
      className={cn('calendar-event group', categoryClass, 'animate-fade-in')}
      onClick={() => onClick(event)}
    >
      <div className="font-medium">{event.title}</div>
      
      {event.location && (
        <div className="hidden group-hover:flex items-center text-xs opacity-90 mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate">{event.location}</span>
        </div>
      )}
      
      {!event.allDay && (
        <div className="hidden group-hover:flex items-center text-xs opacity-90 mt-1">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatTimeRange()}</span>
        </div>
      )}
    </div>
  );
};

export default EventItem;
