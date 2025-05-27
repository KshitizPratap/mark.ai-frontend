import React from 'react';
import { Post as PostType } from '@/types/post';

interface PostAnalytics {
  likes: number;
  comments: number;
  views: number;
}

interface DashboardAnalyticsProps {
  postCreatedCount: number;
  postScheduledCount: number;
  selectedPost: PostType | null;
  postAnalytics: PostAnalytics;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  postCreatedCount,
  postScheduledCount,
  selectedPost,
  postAnalytics
}) => {
  return (
    <div className="flex w-[95%] mx-auto gap-[10px] justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex-1 bg-[#FF89004D] p-5 rounded-lg text-center w-[246px] h-[108px]">
          <h3 className="text-base font-semibold text-gray-800 m-0 mb-[10px]">Post created</h3>
          <p className="text-2xl font-bold text-gray-800 m-0">{postCreatedCount}</p>
        </div>
        <div className="flex-1 bg-[#FF89004D] p-5 rounded-lg text-center w-[246px] h-[108px]">
          <h3 className="text-base font-semibold text-gray-800 m-0 mb-[10px]">Post scheduled</h3>
          <p className="text-2xl font-bold text-gray-800 m-0">{postScheduledCount}</p>
        </div>
      </div>
      <div className="flex-1 bg-[#FF89004D] p-5 rounded-lg text-center w-[444px] h-[247px]">
        <h3 className="text-base font-semibold text-gray-800 m-0 mb-[10px]">Ayrshare analytics</h3>
        {selectedPost ? (
          <div className="mt-[10px]">
            <p className="text-sm text-gray-800 my-[5px]">Likes: {postAnalytics.likes}</p>
            <p className="text-sm text-gray-800 my-[5px]">Comments: {postAnalytics.comments}</p>
            <p className="text-sm text-gray-800 my-[5px]">Views: {postAnalytics.views}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80%]">
            <img
              src="https://via.placeholder.com/150x100.png?text=Graph"
              alt="Analytics Graph Placeholder"
              className="w-[150px] h-[100px] mb-[10px]"
            />
            <p className="text-sm text-gray-800 my-[5px]">Select a post to view analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalytics; 