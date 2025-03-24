
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarHeaderProps, CalendarView } from '@/types/calendar';
import { format, addMonths, subMonths, startOfMonth, addWeeks, subWeeks, addDays, subDays, setYear, getYear } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  date,
  onViewChange,
  onDateChange
}) => {
  const handlePrevious = () => {
    switch (view) {
      case 'day':
        onDateChange(subDays(date, 1));
        break;
      case 'week':
        onDateChange(subWeeks(date, 1));
        break;
      case 'month':
        onDateChange(subMonths(date, 1));
        break;
      case 'year':
        onDateChange(setYear(date, getYear(date) - 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'day':
        onDateChange(addDays(date, 1));
        break;
      case 'week':
        onDateChange(addWeeks(date, 1));
        break;
      case 'month':
        onDateChange(addMonths(date, 1));
        break;
      case 'year':
        onDateChange(setYear(date, getYear(date) + 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'day':
        return format(date, 'EEEE, MMMM d, yyyy');
      case 'week':
        return `Week of ${format(date, 'MMMM d, yyyy')}`;
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'year':
        return format(date, 'yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-semibold tracking-tight">{getHeaderTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleToday}
          className="animate-fade-in hover:bg-primary/10">
          Today
        </Button>
        
        <div className="flex items-center rounded-md border border-input bg-background">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevious}
            className="rounded-l-md hover:bg-primary/10">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNext}
            className="rounded-r-md hover:bg-primary/10">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="hidden md:block">
          <Select
            value={view}
            onValueChange={(value) => onViewChange(value as CalendarView)}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
