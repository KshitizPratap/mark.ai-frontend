import React from 'react';
import { Post } from '@/types/post';
import { formatTime12Hour } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { Image } from 'lucide-react';

interface PostIndicatorProps {
  post: Post;
  onClick: (postId: string | number) => void;
}

const PostIndicator: React.FC<PostIndicatorProps> = ({ post, onClick }) => {

  if (post.status === 'deleted' || post.status === 'live') return null;

  const handleClick = () => {
    onClick(post._id || '');
  };

  const postType = post.status === 'schedule' ? 'scheduled' : 'draft';
  
  const imageUrl = post.mediaUrl.length > 0 && post.mediaUrl[0] 

  return (
    <div 
      className={cn(
        "post-indicator cursor-pointer flex items-center gap-2 px-1 py-0.5",
        postType
      )}
      onClick={handleClick}
    > 
      { imageUrl ? <img 
        src={imageUrl} 
        alt={post.title}
        className="w-4 h-4 rounded-sm object-cover"
      />
    :  <Image className="w-4 h-4 text-gray-400" />
    }
      <span className="post-time text-xs">{formatTime12Hour(post.scheduleDate)}</span>
    </div>
  );
};

export default PostIndicator; 