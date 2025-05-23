import React from 'react';

interface DayHeaderCellMonthProps {
  day: string;
}

const DayHeaderCellMonth: React.FC<DayHeaderCellMonthProps> = ({ day }) => {
  return (
    <div className="h-10 flex items-center justify-center border-b">
      <span className="font-poppins text-sm font-medium text-day-text">
        {day}
      </span>
    </div>
  );
};

export default DayHeaderCellMonth;
