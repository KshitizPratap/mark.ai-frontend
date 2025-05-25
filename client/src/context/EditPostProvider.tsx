import React, { createContext, useContext } from 'react';
import useEditPost from '@/hooks/use-edit-post';
import EditPost from '@/components/EditPost';
import { Post } from '@/types/post';

interface EditPostContextType {
  isOpen: boolean;
  post: Post;
  isLoading: boolean;
  onOpen: (postId?: string, postData?: Post, timeZoneLabel?: string) => void;
  onClose: () => void;
  onSave: (post: Post) => Promise<void>;
  onDelete: () => Promise<void>;
  onGenerate: (prompt: string) => Promise<void>;
  timeZoneLabel?: string;
}

// Create context
const EditPostContext = createContext<EditPostContextType | undefined>(undefined);

// Provider component
export const EditPostProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const editPost = useEditPost();
  const [timeZoneLabel, setTimeZoneLabel] = React.useState<string>('GMT+00:00');

  const onOpen = (postId?: string, postData?: Post, timeZone?: string) => {
    if (timeZone) {
      setTimeZoneLabel(timeZone);
    }
    editPost.onOpen(postId, postData);
  };

  return (
    <EditPostContext.Provider value={{ ...editPost, onOpen, timeZoneLabel }}>
      <EditPost 
        isOpen={editPost.isOpen}
        onClose={editPost.onClose}
        post={editPost.post}
        onSave={editPost.onSave}
        onDelete={editPost.onDelete}
        onGenerate={editPost.onGenerate}
      />
      {children}
    </EditPostContext.Provider>
  );
};

// Hook for consuming the context
export const useEditPostContext = () => {
  const context = useContext(EditPostContext);
  if (context === undefined) {
    throw new Error('useEditPostContext must be used within an EditPostProvider');
  }
  return context;
};

export default EditPostProvider;