import React from 'react';
import { Post } from '@/types/post';
import { formatTime12Hour } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface PostIndicatorProps {
  post: Post;
  onClick: (postId: string | number) => void;
}

const PostIndicator: React.FC<PostIndicatorProps> = ({ post, onClick }) => {

  if (post.status === 'deleted') return null;

  const handleClick = () => {
    onClick(post._id || '');
  };

  const postType = post.status === 'schedule' ? 'scheduled' : 'draft';
  
  // Get first image from mediaUrl or use sample image
  const imageUrl = post.mediaUrl.length > 0 
    ? post.mediaUrl[0] 
    : 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100&h=100';

  return (
    <div 
      className={cn(
        "post-indicator cursor-pointer flex items-center gap-2 px-1 py-0.5",
        postType
      )}
      onClick={handleClick}
    > 
      <img 
        src={imageUrl} 
        alt={post.title}
        className="w-4 h-4 rounded-sm object-cover"
      />
      <span className="post-time text-xs">{formatTime12Hour(post.scheduleDate)}</span>
    </div>
  );
};

export default PostIndicator; 