import React from 'react';
import { cn } from '@/lib/utils';

interface DayHeaderCellWeekProps {
  day: string;
  date: number;
  isToday: boolean;
}

const DayHeaderCellWeek: React.FC<DayHeaderCellWeekProps> = ({ 
  day, 
  date, 
  isToday 
}) => {
  return (
    <div className="border-b border-r py-2 px-1">
      <div className="flex flex-col items-center">
        <span className={cn(
          "text-sm font-medium font-poppins",
          isToday ? "text-today-bg" : "text-day-text"
        )}>
          {day}
        </span>
        <div className={cn(
          "w-7 h-7 flex items-center justify-center mt-1 font-poppins font-medium text-xs",
          isToday ? "bg-today-bg text-today-text rounded-full" : "text-day-text"
        )}>
          {date}
        </div>
      </div>
    </div>
  );
};

export default DayHeaderCellWeek;
