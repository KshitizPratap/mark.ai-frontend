import React from 'react';
import { Post } from '@/types/post';
import { 
  DAYS_OF_WEEK, 
  getCalendarDates, 
  isToday, 
  isCurrentMonth, 
  getPostsForDay
} from '@/utils/dateUtils';
import DayHeaderCellMonth from './DayHeaderCellMonth';
import DayCellMonth from './DayCellMonth';

interface MonthViewProps {
  displayDate: Date;
  posts: Post[];
  onPostClick: (postId: string | number) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  displayDate,
  posts,
  onPostClick,
}) => {
  const calendarDates = getCalendarDates(displayDate);
  
  return (
    <>
      <div className="month-grid border border-border rounded-lg overflow-hidden animate-fade-in">
        {/* Day headers */}
        {DAYS_OF_WEEK.map((day) => (
          <DayHeaderCellMonth key={day} day={day} />
        ))}
        
        {/* Day cells */}
        {calendarDates.map((date, index) => {
          const postsForDay = getPostsForDay(posts, date);
          return (
            <DayCellMonth
              key={index}
              date={date}
              posts={postsForDay}
              isToday={isToday(date)}
              isCurrentMonth={isCurrentMonth(date, displayDate)}
              onPostClick={onPostClick}
            />
          );
        })}
      </div>
    </>
  );
};

export default MonthView;
