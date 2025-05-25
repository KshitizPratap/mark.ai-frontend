import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarView } from '@/types/post';

interface ActionScreenHeaderProps {
  title: string;
  timeframe: CalendarView;
  setTimeframe: (timeframe: CalendarView) => void;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  weekStart: Date;
  weekEnd: Date;
  setWeekStart: (date: Date) => void;
  setWeekEnd: (date: Date) => void;
  weekNavigationCountRef: React.MutableRefObject<number>;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper function to get ordinal suffix (st, nd, rd, th)
const getOrdinalSuffix = (day: number) => {
  if (day % 10 === 1 && day !== 11) return `${day}st`;
  if (day % 10 === 2 && day !== 12) return `${day}nd`;
  if (day % 10 === 3 && day !== 13) return `${day}rd`;
  return `${day}th`;
};

// Format the week range with ordinal suffixes (e.g., "1st - 7th May")
const getWeekRange = (weekStart: Date, weekEnd: Date) => {
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = months[weekStart.getMonth()];
  const endMonth = months[weekEnd.getMonth()];
  const startDayWithSuffix = getOrdinalSuffix(startDay);
  const endDayWithSuffix = getOrdinalSuffix(endDay);
  return startMonth === endMonth
    ? `${startDayWithSuffix} - ${endDayWithSuffix} ${startMonth}`
    : `${startDayWithSuffix} ${startMonth} - ${endDayWithSuffix} ${endMonth}`;
};

const ActionScreenHeader: React.FC<ActionScreenHeaderProps> = ({
  title,
  timeframe,
  setTimeframe,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  weekStart,
  weekEnd,
  setWeekStart,
  setWeekEnd,
  weekNavigationCountRef,
}) => {

  const handlePrevPeriod = () => {
    if (timeframe === 'month') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      const newWeekStart = new Date(weekStart);
      newWeekStart.setDate(weekStart.getDate() - 7);
      const newWeekEnd = new Date(weekEnd);
      newWeekEnd.setDate(weekEnd.getDate() - 7);
      setWeekStart(newWeekStart);
      setWeekEnd(newWeekEnd);
      weekNavigationCountRef.current -= 1;
    }
  };

  const handleNextPeriod = () => {
    if (timeframe === 'month') {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    } else {
      const newWeekStart = new Date(weekStart);
      newWeekStart.setDate(weekStart.getDate() + 7);
      const newWeekEnd = new Date(weekEnd);
      newWeekEnd.setDate(weekEnd.getDate() + 7);
      setWeekStart(newWeekStart);
      setWeekEnd(newWeekEnd);
      weekNavigationCountRef.current += 1;
    }
  };

  return (
    <div className="relative px-5 pt-2 bg-white mb-5">
      <h2 className="text-2xl font-semibold text-gray-800 m-0 pl-5">{title}</h2>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-0">
          <ChevronLeft
            className="text-lg text-black cursor-pointer transition-transform duration-200 hover:scale-110 ml-[10px]"
            onClick={handlePrevPeriod}
          />
          <ChevronRight
            className="text-lg text-black cursor-pointer transition-transform duration-200 hover:scale-110 ml-[10px]"
            onClick={handleNextPeriod}
          />
          <span className="text-base text-gray-800">
            {timeframe === 'month' ? `${months[selectedMonth]} ${selectedYear}` : getWeekRange(weekStart, weekEnd)}
          </span>
        </div>
        <div className="flex rounded overflow-hidden">
          <button
            className={`px-5 py-[5px] text-sm cursor-pointer transition-colors duration-200 rounded ${
              timeframe === 'month' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-800'
            } border-none`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button
            className={`px-5 py-[5px] text-sm cursor-pointer transition-colors duration-200 rounded ${
              timeframe === 'week' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-800'
            } border-none`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionScreenHeader;