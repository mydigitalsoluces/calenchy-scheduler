
import React, { useMemo } from 'react';
import { format, setMonth, eachMonthOfInterval, startOfYear, endOfYear, getMonth, isSameMonth } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface YearViewProps {
  date: Date;
  events: CalendarEvent[];
  onMonthClick: (date: Date) => void;
}

const YearView: React.FC<YearViewProps> = ({
  date,
  events,
  onMonthClick,
}) => {
  const months = useMemo(() => {
    const start = startOfYear(date);
    const end = endOfYear(date);
    return eachMonthOfInterval({ start, end });
  }, [date]);

  const getMonthEventCount = (month: Date) => {
    return events.filter(event => 
      getMonth(event.start) === getMonth(month) && 
      format(event.start, 'yyyy') === format(month, 'yyyy')
    ).length;
  };

  const isCurrentMonth = (month: Date) => {
    const now = new Date();
    return isSameMonth(month, now);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map((month) => (
          <div
            key={month.toString()}
            className={cn(
              "border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors",
              isCurrentMonth(month) && "bg-calendar-today border-primary/30"
            )}
            onClick={() => onMonthClick(month)}
          >
            <div className="text-center mb-2">
              <h3 className="text-lg font-medium">{format(month, 'MMMM')}</h3>
            </div>
            
            <div className="text-sm text-center text-muted-foreground">
              {getMonthEventCount(month)} events
            </div>
            
            {getMonthEventCount(month) > 0 && (
              <div className="mt-2 flex justify-center">
                <div 
                  className="w-full max-w-[60%] h-1.5 rounded-full bg-primary/20 overflow-hidden"
                >
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(100, getMonthEventCount(month) * 10)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearView;
