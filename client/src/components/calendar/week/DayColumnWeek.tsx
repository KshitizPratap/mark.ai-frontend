import React from 'react';
import CurrentTimeIndicator from './CurrentTimeIndicator';
import { getHoursArray } from '@/utils/dateUtils';
import { PostsByDateTime, getPostsForDateTime } from '@/utils/postUtils';
import PostIndicator from '../post/PostIndicator';

interface DayColumnWeekProps {
  date: Date;
  postsMap: PostsByDateTime;
  isToday: boolean;
  onPostClick: (postId: string | number) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

const DayColumnWeek: React.FC<DayColumnWeekProps> = ({
  date,
  postsMap,
  isToday,
  onPostClick,
}) => {
  const hours = getHoursArray();
  
  return (
    <div className="relative flex-1 border-r border-slate-200">
      {/* Grid container with relative positioning */}
      <div className="relative h-[1440px]">
        {/* Hour cells - one for each hour */}
        {hours.map((hour) => {
          const postsForHour = getPostsForDateTime(postsMap, date, hour);
          return (
            <div 
              key={hour} 
              className="h-[60px] border-b border-slate-200 relative cursor-pointer hover:bg-gray-50"
              data-hour={hour}
            >
              {/* Render posts for this hour with scrolling */}
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="space-y-1 p-1">
                  {postsForHour.map((post) => (
                    <PostIndicator
                      key={post._id}
                      post={post}
                      onClick={onPostClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Current time indicator */}
        <CurrentTimeIndicator isToday={isToday} />
      </div>
    </div>
  );
};

export default DayColumnWeek;
