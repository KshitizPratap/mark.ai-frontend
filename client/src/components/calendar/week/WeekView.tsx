import React, { useMemo } from 'react';
import { Post } from '@/types/post';
import { 
  DAYS_OF_WEEK, 
  getWeekDates, 
  isToday
} from '@/utils/dateUtils';
import { preprocessPosts } from '@/utils/postUtils';
import DayHeaderCellWeek from './DayHeaderCellWeek';
import DayColumnWeek from './DayColumnWeek';
import TimeGutter from './TimeGutter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface WeekViewProps {
  displayDate: Date;
  posts: Post[];
  onPostClick: (postId: string | number) => void;
  onTimeSlotClick?: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  displayDate,
  posts,
  onPostClick,
  onTimeSlotClick,
}) => {
  const weekDates = getWeekDates(displayDate);
  const { toast } = useToast();
  
  // Preprocess posts once and memoize the result
  const postsMap = useMemo(() => preprocessPosts(posts), [posts]);
  
  return (
    <>
    <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden animate-view-switch bg-white">
      
      {/* Header row */}
      <div className="grid grid-cols-[60px,repeat(7,1fr)] border-b border-slate-200">
        <div className="border-r border-slate-200"></div>
        {weekDates.map((date, index) => (
          <DayHeaderCellWeek
          key={index}
          day={DAYS_OF_WEEK[date.getDay()]}
          date={date.getDate()}
          isToday={isToday(date)}
          />
        ))}
      </div>
      
      {/* Week grid with scrollable content */}
      <ScrollArea className="h-[60vh]">
        <div className="grid grid-cols-[60px,repeat(7,1fr)] relative" style={{ height: '1440px' }}>
          <TimeGutter />
          
          {weekDates.map((date, index) => (
            <DayColumnWeek
            key={index}
            date={date}
            postsMap={postsMap}
            isToday={isToday(date)}
            onPostClick={onPostClick}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
    </>
  );
};

export default WeekView;
