"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'lucide-react';
import twitterIcon from '../assets/icons/twitter.png';
import instagramIcon from '../assets/icons/instagram.png';
import tiktokIcon from '../assets/icons/tiktok.png';
import linkedinIcon from '../assets/icons/linkedin.png';
import facebookIcon from '../assets/icons/facebook.png';
import youtubeIcon from '../assets/icons/youtube.png';
import ActionScreenHeader from './ActionScreenHeader.tsx';
import { CalendarView, Post as PostType, PlatformType } from '@/types/post';
import { syncPostsFromDB } from '@/utils/postSync';
import { usePostStore } from '@/store/usePostStore';
import { useEditPostContext } from '@/context/EditPostProvider';

type TabType = 'past' | 'upcoming' | 'drafts';

// Define supported platforms for icons
type SupportedPlatform = 'twitter' | 'instagram' | 'tiktok' | 'linkedin' | 'facebook' | 'youtube';

interface PostAnalytics {
  likes: number;
  comments: number;
  views: number;
}

const Dashboard = () => {
  const today = new Date();
  const [activeTab, setActiveTab] = useState<TabType>('past');
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [postAnalytics, setPostAnalytics] = useState<PostAnalytics>({
    likes: 0,
    comments: 0,
    views: 0
  });
  const [timeframe, setTimeframe] = useState<CalendarView>('month');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const weekNavigationCountRef = useRef<number>(0);
  const posts = usePostStore((state) => state.posts);
  const editPostContext = useEditPostContext();

  // Effect for syncing posts when month or week changes
  useEffect(() => {
    syncPosts();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedMonth, selectedYear, weekStart, weekEnd]);

  // Effect for syncing posts when timeframe changes
  useEffect(() => {
    syncPostsFromDB(getDisplayDate());
    weekNavigationCountRef.current = 0;
  }, [timeframe]);

  const syncPosts = async () => {
    setError(null);
    try {
      debounceRef.current = setTimeout(async () => {
        const shouldSync = timeframe === 'month' || (timeframe === 'week' && Math.abs(weekNavigationCountRef.current) >= 3);
        
        if (shouldSync) {
          setLoading(true);
          await syncPostsFromDB(getDisplayDate());
          if (timeframe === 'week') {
            weekNavigationCountRef.current = 0;
          }
          setLoading(false);
        }
      }, 500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(errorMessage);
      setLoading(false);
    }
  };

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

  // Map activeTab  status for API
  const getStatusFromTab = (tab: TabType): string => {
    const statusMap: Record<TabType, string> = {
      past: 'published',
      upcoming: 'schedule',
      drafts: 'draft',
    };
    return statusMap[tab];
  };

  // Filter posts by timeframe (month/week)
  const timeframeFilteredPosts = posts.filter(post => {
    const postDate = new Date(post.scheduleDate);
    if (timeframe === 'month') {
      return postDate.getMonth() === selectedMonth && postDate.getFullYear() === selectedYear;
    } else {
      return postDate >= weekStart && postDate <= weekEnd;
    }
  });

  // Filter posts by status based on active tab
  const filteredPosts = timeframeFilteredPosts.filter(post => {
    const statusMap: Record<TabType, string> = {
      past: 'published',
      upcoming: 'schedule',
      drafts: 'draft'
    };
    return post.status === statusMap[activeTab];
  });

  const postCreatedCount = timeframeFilteredPosts.filter(post => post.status === 'published').length;
  const postScheduledCount = timeframeFilteredPosts.filter(post => post.status === 'schedule').length;

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' -');
  };

  const getPlatformIcon = (platform?: PlatformType[]) => {
    const platformIcons: Record<SupportedPlatform, string> = {
      twitter: twitterIcon,
      instagram: instagramIcon,
      tiktok: tiktokIcon,
      linkedin: linkedinIcon,
      facebook: facebookIcon,
      youtube: youtubeIcon
    };

    const platformName = platform?.[0] as SupportedPlatform | undefined;
    if (platformName && platformName in platformIcons) {
      return (
        <img
          src={platformIcons[platformName]}
          alt={platformName}
          className="w-[22px] h-[22px] ml-[15px] object-contain transition-transform duration-200 hover:scale-110"
        />
      );
    }
    return null;
  };

  const handlePostClick = (post: PostType) => {
    if (post) {
      editPostContext.onOpen(post._id, post, 'GMT+00:00');
    }
  };

  return (
    <div className="w-full h-full p-5 border border-gray-300 bg-white overflow-y-auto box-border relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <ActionScreenHeader
        title="Dashboard"
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
      {false && 
      (
        <div className="flex gap-[10px] justify-between">
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
      )}
      <div
        id="posts-container"
        className={`absolute left-1/2 transform -translate-x-1/2 w-[95%] max-w-full overflow-x-hidden overflow-y-auto rounded-[10px] bg-gray-200/30 bottom-0 ${
          false ? 'top-[450px]' : 'top-[150px]'
        }`}
      >
        <div className="flex justify-center m-[20px_30px] pb-[10px]">
          {(['past', 'upcoming', 'drafts'] as const).map(tab => (
            <button
              key={tab}
              id={activeTab === tab ? 'active-tab-button' : 'tab-button'}
              className={`flex-1 text-center p-[10px] cursor-pointer text-sm ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 font-bold text-blue-500'
                  : 'font-normal border-b-2 border-grey-200 text-black transition-all duration-200 hover:text-gray-600 hover:bg-gray-100'
              } px-[15px] py-[8px]`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Posts
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-[5px]">
          {loading && <p className="text-center text-gray-600">Loading posts...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && filteredPosts.length === 0 && (
            <p className="text-center text-gray-600">No posts found.</p>
          )}
          {filteredPosts.map((post, index) => {
            const media = post.mediaUrl?.[0];
            const isImage = media && /\.(jpg|jpeg|png|gif)$/i.test(media);
            const isVideo = media && /\.(mp4|mov|webm)$/i.test(media);

            return (
              <div
                key={post._id}
                id="post-item"
                className={`p-5 rounded-lg overflow-hidden box-border flex justify-between items-center transition-all duration-200 m-[0_30px_15px_30px] hover:translate-x-[5px] ${
                  index % 2 
                    ? 'bg-gradient-to-r from-rose-300 to-pink-400' 
                    : 'bg-gradient-to-r from-blue-300 to-sky-400'
                }`}
                onClick={() => handlePostClick(post)}
                style={{ cursor: 'pointer' }}
              >
                <div className="w-[50px] h-[50px] mr-[15px] flex-shrink-0 flex items-center justify-center overflow-hidden rounded-[6px] bg-gray-100 border border-gray-300">
                  {isImage && (
                    <img src={media} alt="Media Preview" className="max-w-full max-h-full object-cover rounded" />
                  )}
                  {isVideo && (
                    <video className="max-w-full max-h-full object-cover rounded" muted>
                      <source src={media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {!isImage && !isVideo && (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50">
                      <Image className="w-5 h-5 text-gray-400" />
                      <span className="text-[8px] text-gray-400 mt-1">No Media</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 break-words">
                  <h4 id="post-title" className={`m-0 mb-[5px] data-cy='post-title' text-lg font-['Dancing_Script'] font-bold text-gray-800 tracking-wide transition-colors duration-300 ${
                    index % 2 
                      ? 'hover:text-indigo-600'  // For pink background
                      : 'hover:text-rose-500'    // For blue background
                  }`}>
                    {post.title} : {post.status}
                  </h4>
                  <p id="post-date" className="m-0 text-[13px] text-black font-normal">
                    {formatDate(post.scheduleDate)}
                  </p>
                </div>

                {getPlatformIcon(post.platform)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;