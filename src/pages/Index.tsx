
import React from 'react';
import { CalendarProvider } from '@/context/CalendarContext';
import CalendarApp from '@/components/calendar/CalendarApp';

const Index = () => {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  );
};

export default Index;
