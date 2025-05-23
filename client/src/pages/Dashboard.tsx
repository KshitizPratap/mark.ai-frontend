// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/postServices.ts';
import twitterIcon from '../assets/icons/twitter.png';
import instagramIcon from '../assets/icons/instagram.png';
import tiktokIcon from '../assets/icons/tiktok.png';
import linkedinIcon from '../assets/icons/linkedin.png';
import facebookIcon from '../assets/icons/facebook.png';
import youtubeIcon from '../assets/icons/youtube.png';
import ActionScreenHeader from './ActionScreenHeader.tsx';
import { CalendarView } from '@/types/post';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('past');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(4); // 0-based index for May
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedPost, setSelectedPost] = useState(null);
  const [timeframe, setTimeframe] = useState<CalendarView>('month'); // Track 'month' or 'week'
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date('2025-05-20'); // Updated to current date
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek); // Start of week (Sunday)
    return start;
  });
  const [weekEnd, setWeekEnd] = useState(() => {
    const today = new Date('2025-05-20'); // Updated to current date
    const dayOfWeek = today.getDay();
    const end = new Date(today);
    end.setDate(today.getDate() + (6 - dayOfWeek)); // End of week (Saturday)
    return end;
  });
  const [allPosts, setAllPosts] = useState([]); // Store all fetched posts for counts
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
    }
  };

  // Format date to YYYY-MM-DD for API
  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0]; // e.g., "2025-05-01"
  };

  // Get startDate and endDate based on timeframe
  const getDateRange = () => {
    let startDate, endDate;
    if (timeframe === 'month') {
      startDate = new Date(selectedYear, selectedMonth, 1); // First day of the month
      endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the month
    } else {
      startDate = new Date(weekStart);
      endDate = new Date(weekEnd);
    }
    return {
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
    };
  };

  // Map activeTab to status for API
  const getStatusFromTab = (tab: string) => {
    const statusMap = {
      past: 'public',
      upcoming: 'schedule',
      drafts: 'draft',
    };
    return statusMap[tab] || '';
  };

  // Fetch posts from API
  const fetchPosts = async (tab: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const status = getStatusFromTab(tab);
      const params = {
        status,
        startDate,
        endDate,
      };
      const posts = await getPosts(params);
      // Ensure posts is an array; fallback to empty array if not
      const postsArray = Array.isArray(posts) ? posts : [];
      setAllPosts(postsArray);
      setFilteredPosts(postsArray);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      setAllPosts([]); // Reset to empty array on error
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Update counts based on fetched posts
  const postCreatedCount = allPosts.filter(post => {
    const postDate = new Date(post.scheduleDate || post.createdAt);
    if (timeframe === 'month') {
      return post.status === 'public' && postDate.getMonth() === selectedMonth && postDate.getFullYear() === selectedYear;
    } else {
      return post.status === 'public' && postDate >= weekStart && postDate <= weekEnd;
    }
  }).length;

  const postScheduledCount = allPosts.filter(post => {
    const postDate = new Date(post.scheduleDate || post.createdAt);
    if (timeframe === 'month') {
      return post.status === 'schedule' && postDate.getMonth() === selectedMonth && postDate.getFullYear() === selectedYear;
    } else {
      return post.status === 'schedule' && postDate >= weekStart && postDate <= weekEnd;
    }
  }).length;

  useEffect(() => {
    const { startDate, endDate } = getDateRange();
    fetchPosts(activeTab, startDate, endDate);
  }, [activeTab, selectedMonth, selectedYear, timeframe, weekStart, weekEnd]);

  const formatDate = (dateString: string) => {
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

  const getPlatformIcon = (platform: string[]) => {
    const platformIcons = {
      twitter: twitterIcon,
      instagram: instagramIcon,
      tiktok: tiktokIcon,
      linkedin: linkedinIcon,
      facebook: facebookIcon,
      youtube: youtubeIcon
    };

    const platformName = platform && platform[0]; // Access first platform in array
    if (platformName && platformIcons[platformName]) {
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

  return (
    <div className="w-full h-full p-5 border border-gray-300 bg-white overflow-y-auto box-border relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <ActionScreenHeader
        title="Dashboard"
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        weekStart={weekStart}
        weekEnd={weekEnd}
        handlePrevPeriod={handlePrevPeriod}
        handleNextPeriod={handleNextPeriod}
      />
      {selectedPost && (
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
                <p className="text-sm text-gray-800 my-[5px]">Likes: {selectedPost.likes || 234}</p>
                <p className="text-sm text-gray-800 my-[5px]">Comments: {selectedPost.comments || 45}</p>
                <p className="text-sm text-gray-800 my-[5px]">Views: {selectedPost.views || 1250}</p>
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
          selectedPost ? 'top-[450px]' : 'top-[150px]'
        }`}
      >
        <div className="flex justify-center m-[20px_30px] pb-[10px]">
          {['past', 'upcoming', 'drafts'].map(tab => (
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
          {loading && <p className="text-center text-gray-600">Loading...</p>}
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
                  index % 2 ? 'bg-yellow-500' : 'bg-purple-200'
                }`}
                onClick={() => setSelectedPost(post)}
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
                </div>

                <div className="flex-1 min-w-0 break-words">
                  <h4 id="post-title" className="m-0 mb-[5px] data-cy='post-title' text-base text-gray-800 font-semibold">
                    {post.title}
                  </h4>
                  <p id="post-date" className="m-0 text-[13px] text-black font-normal">
                    {formatDate(post.scheduleDate || post.createdAt)}
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