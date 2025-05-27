import React from 'react';
import { Image } from 'lucide-react';
import { Post as PostType } from '@/types/post';
import { PlatformType } from '@/types';
import twitterIcon from '../../assets/icons/twitter.png';
import instagramIcon from '../../assets/icons/instagram.png';
import tiktokIcon from '../../assets/icons/tiktok.png';
import linkedinIcon from '../../assets/icons/linkedin.png';
import facebookIcon from '../../assets/icons/facebook.png';
import youtubeIcon from '../../assets/icons/youtube.png';
import threadsIcon from '../../assets/icons/threads.png';

type TabType = 'past' | 'upcoming' | 'drafts';

interface PostsListProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  filteredPosts: PostType[];
  loading: boolean;
  error: string | null;
  onPostClick: (post: PostType) => void;
}

const PostsList: React.FC<PostsListProps> = ({
  activeTab,
  setActiveTab,
  filteredPosts,
  loading,
  error,
  onPostClick
}) => {
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
    const platformIcons: Partial<Record<PlatformType, string>> = {
      twitter: twitterIcon,
      instagram: instagramIcon,
      tiktok: tiktokIcon,
      linkedin: linkedinIcon,
      facebook: facebookIcon,
      youtube: youtubeIcon,
      threads: threadsIcon
    };

    if (!platform || platform.length === 0) return null;

    return (
      <div className="flex items-center gap-2 ml-[15px]">
        {platform.map((platformName, index) => {
          if (platformIcons[platformName]) {
            return (
              <img
                key={`${platformName}-${index}`}
                src={platformIcons[platformName]}
                alt={platformName}
                className="w-[22px] h-[22px] object-contain transition-transform duration-200 hover:scale-110"
              />
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div
      id="posts-container"
      className="relative w-[95%] max-w-full mx-auto overflow-x-hidden overflow-y-auto rounded-[10px] bg-gray-200/30 mt-4 min-h-[60vh] flex flex-col"
    >
        {/* Tabs */}
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

       {/* Posts List Container */}
      <div className="flex flex-col gap-[5px] flex-1">
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-gray-600">Loading posts...</p>
          </div>
        )}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-red-500">{error}</p>
          </div>
        )}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-gray-600">No posts found.</p>
          </div>
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
              onClick={() => onPostClick(post)}
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
  );
};

export default PostsList; 