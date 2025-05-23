import React from 'react';
import { Post, CalendarView } from '@/types/post';
import MonthView from './month/MonthView';
import WeekView from './week/WeekView';
import { useEditPostContext } from '@/context/EditPostProvider';

interface SocialCalendarProps {
  posts: Post[];
  timeZoneLabel?: string;
  minWidth?: string | number;
  maxWidth?: string | number;
  isLoading?: boolean;
  currentView?: CalendarView;
  displayDate?: Date;
}

const SocialCalendar: React.FC<SocialCalendarProps> = ({
  posts = [],
  timeZoneLabel = 'GMT+00:00',
  minWidth = '300px',
  isLoading = false,
  currentView = 'month',
  displayDate = new Date(),
}) => {
  const editPostContext = useEditPostContext();

  const handlePostClick = (postId: string | number) => {
    const post = posts.find(p => p._id === postId);
    if (post) {
      const postWithRequiredFields = {
        ...post,
        postType: post.postType || 'post'
      };
      editPostContext.onOpen(post._id, postWithRequiredFields, timeZoneLabel);
    }
  };

  return (
    <div 
      className="calendar-container bg-calendar-bg p-4 rounded-xl"
      style={{ 
        minWidth, 
      }}
    >
      {!isLoading && (
        <div className="text-xs text-gray-500 font-poppins px-4 py-2 text-left">
          {timeZoneLabel}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : currentView === 'month' ? (
        <MonthView
          displayDate={displayDate}
          posts={posts}
          onPostClick={handlePostClick}
        />
      ) : (
        <WeekView
          displayDate={displayDate}
          posts={posts}
          onPostClick={handlePostClick}
        />
      )}
    </div>
  );
};

export default SocialCalendar;
