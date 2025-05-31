import React from 'react';
import { Image } from 'lucide-react';
import { Post as PostType } from '@/types/post';
import { PlatformType } from '@/types';
import { SocialIconComponents } from '@/assets/icons/social/SocialIcons';

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
    const platformIcons: Partial<Record<PlatformType, React.ComponentType<any>>> = {
      twitter: SocialIconComponents.twitter,
      instagram: SocialIconComponents.instagram,
      tiktok: SocialIconComponents.tiktok,
      linkedin: SocialIconComponents.linkedin,
      facebook: SocialIconComponents.facebook,
      youtube: SocialIconComponents.youtube,
      threads: SocialIconComponents.threads
    };

    if (!platform || platform.length === 0) return null;

    return (
      <div className="flex items-center gap-2 ml-[15px]">
        {platform.map((platformName, index) => {
          const IconComponent = platformIcons[platformName];
          if (IconComponent) {
            return (
              <div
                key={`${platformName}-${index}`}
                className="w-[22px] h-[22px] flex items-center justify-center transition-transform duration-200 hover:scale-110"
              >
                <IconComponent
                  size={22}
                  className="object-contain"
                />
              </div>
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
      className="relative w-[95%] max-w-full mx-auto overflow-x-hidden overflow-y-auto rounded-[10px] bg-white mt-4 min-h-[60vh] flex flex-col border border-gray-300"
      style={{ fontFamily: 'var(--font-family-Font-1)' }}
    >
        {/* Tabs */}
      <div className="flex justify-center m-[20px_30px] pb-[10px]">
        {(['past', 'upcoming', 'drafts'] as const).map(tab => (
          <button
            key={tab}
            id={activeTab === tab ? 'active-tab-button' : 'tab-button'}
            className={`flex-1 text-center p-[10px] cursor-pointer text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 font-semibold text-blue-600 bg-blue-50'
                : 'border-b-2 border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:border-gray-400'
            } px-[15px] py-[8px] rounded-t-lg`}
            onClick={() => setActiveTab(tab)}
            style={{ fontFamily: 'var(--font-family-Font-1)' }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Posts
          </button>
        ))}
      </div>

       {/* Posts List Container */}
      <div className="flex flex-col gap-[5px] flex-1">
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-gray-600" style={{ fontFamily: 'var(--font-family-Font-1)' }}>Loading posts...</p>
          </div>
        )}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-red-500" style={{ fontFamily: 'var(--font-family-Font-1)' }}>{error}</p>
          </div>
        )}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-gray-500" style={{ fontFamily: 'var(--font-family-Font-1)' }}>No posts found.</p>
          </div>
        )}
        {filteredPosts.map((post, index) => {
          const media = post.mediaUrl?.[0];
          const isImage = media && (media.startsWith('http://') || media.startsWith('https://'));
          const isVideo = false; // Since we're treating all URLs as images

          return (
            <div
              key={post._id}
              id="post-item"
              className={`p-5 rounded-lg overflow-hidden box-border flex justify-between items-center transition-all duration-200 m-[0_30px_15px_30px] hover:translate-x-[5px] cursor-pointer border ${
                index % 2 
                  ? 'bg-[rgb(8_145_178_/_0.1)] hover:bg-[rgb(8_145_178_/_0.15)] border-[rgb(8_145_178_/_0.3)]' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
              onClick={() => onPostClick(post)}
            >
              <div className="w-[50px] h-[50px] mr-[15px] flex-shrink-0 flex items-center justify-center overflow-hidden rounded-[6px] bg-white border border-gray-300">
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
                    <span className="text-[8px] text-gray-500 mt-1" style={{ fontFamily: 'var(--font-family-Font-1)' }}>No Media</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 break-words">
                <h4 
                  id="post-title" 
                  className={`m-0 mb-[5px] text-lg font-semibold text-gray-800 tracking-wide transition-colors duration-300 ${
                    index % 2 
                      ? 'hover:text-blue-600'
                      : 'hover:text-blue-700'
                  }`}
                  style={{ 
                    fontFamily: 'var(--font-family-Font-1)',
                    fontWeight: 'var(--font-weight-500)'
                  }}
                >
                  {post.title} : {post.status}
                </h4>
                <p 
                  id="post-date" 
                  className="m-0 text-[13px] text-gray-600 font-normal"
                  style={{ 
                    fontFamily: 'var(--font-family-Font-1)',
                    fontSize: 'var(--font-size-14)'
                  }}
                >
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