
import React from 'react';
import { Post } from '@/types/calendar';
import PostIndicatorMonth from '../post/PostIndicatorMonth';
import { cn } from '@/lib/utils';
import { MONTHS } from '@/utils/dateUtils';

interface DayCellMonthProps {
  date: Date;
  posts: Post[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onPostClick: (postId: string | number) => void;
  onDateSelect: (date: Date) => void;
}

const DayCellMonth: React.FC<DayCellMonthProps> = ({
  date,
  posts,
  isToday,
  isCurrentMonth,
  onPostClick,
  onDateSelect,
}) => {
  const handleClick = () => {
    onDateSelect(date);
  };

  const isFirstOfMonth = date.getDate() === 1;
  
  return (
    <div 
      className={cn(
        "min-h-[100px] p-2 border border-border relative",
        isToday ? "today-cell bg-white" : "",
        !isCurrentMonth ? "other-month bg-gray-50" : "bg-white"
      )}
      onClick={handleClick}
    >
      <div className="mb-2">
        {isFirstOfMonth ? (
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500 font-poppins">
              {MONTHS[date.getMonth()].substring(0, 3)}
            </span>
            <div className={cn(
              "date-number font-poppins font-medium w-7 h-7 flex items-center justify-center",
              isToday ? "bg-today-bg text-today-text" : "text-day-text"
            )}>
              {date.getDate()}
            </div>
          </div>
        ) : (
          <div className={cn(
            "date-number font-poppins font-medium w-7 h-7 flex items-center justify-center",
            isToday ? "bg-today-bg text-today-text" : "text-day-text"
          )}>
            {date.getDate()}
          </div>
        )}
      </div>
      
      <div className="space-y-1 max-h-[80px] overflow-y-auto">
        {posts.map((post) => (
          <PostIndicatorMonth
            key={post.postId}
            post={post}
            onClick={onPostClick}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCellMonth;
