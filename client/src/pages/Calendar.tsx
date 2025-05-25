import React, { useState, useRef, useEffect } from 'react';
import SocialCalendar from '@/components/calendar/SocialCalendar';
import { usePostStore } from '@/store/usePostStore';
import ActionScreenHeader from './ActionScreenHeader';
import { syncPostsFromDB } from '@/utils/postSync';
import { CalendarView } from '@/types/post';

export default function CalendarRoute() {
  const today = new Date();
  const posts = usePostStore((state) => state.posts);
  const [timeframe, setTimeframe] = useState<CalendarView>('month');

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [weekStart, setWeekStart] = useState(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return start;
  });
  const [weekEnd, setWeekEnd] = useState(() => {
    const end = new Date(today);
    end.setDate(today.getDate() + (6 - today.getDay()));
    return end;
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const weekNavigationCountRef = useRef<number>(0);

  // Effect for syncing posts when month or week changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(async () => {
      const shouldSync = timeframe === 'month' || (timeframe === 'week' && Math.abs(weekNavigationCountRef.current) >= 3);
      
      if (shouldSync) {
        await syncPostsFromDB(getDisplayDate());
        if (timeframe === 'week') {
          weekNavigationCountRef.current = 0;
        }
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedMonth, selectedYear, weekStart, weekEnd]);

  useEffect(() => {
    syncPostsFromDB(getDisplayDate());
    weekNavigationCountRef.current = 0;
  }, [timeframe]);

  const getDisplayDate = () => {
    let date;
    if (timeframe === 'month') {
      date = new Date();
      date.setMonth(selectedMonth);
      date.setFullYear(selectedYear);
    } else {
      date = weekStart;
    }
    usePostStore.getState().setDisplayDate(date);
    return date;
  };

  return (
    <div className="p-5 h-full flex flex-col bg-white">
      <ActionScreenHeader
        title="Calendar"
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        weekStart={weekStart}
        weekEnd={weekEnd}
        setWeekStart={setWeekStart}
        setWeekEnd={setWeekEnd}
        weekNavigationCountRef={weekNavigationCountRef}
      />
      <div className="overflow-auto">
        <SocialCalendar
          posts={posts.filter(post => post.status !== 'deleted' && post.status !== 'live')}
          currentView={timeframe}
          displayDate={getDisplayDate()}
        />
      </div>
    </div>
  );
}