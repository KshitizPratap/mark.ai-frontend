import { useState, useCallback } from 'react';
import { Post } from '@/types/post';
import { useToast } from '@/hooks/use-toast';
import { deletePost, updatePost } from '@/services/postServices';
import { syncPostsFromDB } from '@/utils/postSync';
import { usePostStore } from '@/store/usePostStore';
import { PlatformType } from '@/types';

// Define the empty/default post structure
const DEFAULT_POST: Post = {
  _id: undefined,
  userId: '',
  title: '',
  content: '',
  hashtag: '',
  mediaUrl: [],
  platform: [],
  postType: '',
  status: 'draft',
  scheduleDate: new Date(),
  instagramLocationId: "",
  facebookLocationId: "",
};

export interface EditPostStore {
  isOpen: boolean;
  post: Post;
  isLoading: boolean;
  onOpen: (postId?: string, postData?: Post) => void;
  onClose: () => void;
  onSave: (post: Post) => Promise<void>;
  onDelete: () => Promise<void>;
  onGenerate: (prompt: string) => Promise<void>;
}

export const useEditPost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState<Post>(DEFAULT_POST);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const displayDate = usePostStore((state) => state.displayDate);

  // Open the edit modal with a specific post
  const onOpen = useCallback(async (postId?: string, postData?: Post) => {
    if (postData) {
      setPost(postData);
      setIsOpen(true);
      return;
    }
    // If no postData, just set default post (or fetch from API if needed)
    setPost(DEFAULT_POST);
    setIsOpen(true);
  }, [toast]);

  // Close the edit modal
  const onClose = useCallback(() => {
    setIsOpen(false);
    // Reset to default after a short delay to avoid UI flicker
    setTimeout(() => {
      setPost(DEFAULT_POST);
    }, 300);
  }, []);

  // Save the post
  const onSave = useCallback(async (updatedPost: Post) => {
    setIsLoading(true);
    try {
      const response = await updatePost({
        ...updatedPost,
        scheduleDate: updatedPost.scheduleDate.toISOString(),
      }, updatedPost._id || '');


      if (!response?.success) {
        throw new Error('Failed to save post');
      }

      await syncPostsFromDB(displayDate);
      
      setIsOpen(false);
      toast({
        title: 'Success',
        description: updatedPost.status === 'schedule' ? 'Post scheduled successfully!' : 'Post saved as draft!',
      });

      return true;
    } catch (error) {
      toast({
        title: 'Post cannot be saved',
        description: (error as Error).message || 'Failed to save post',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, displayDate]);

  // Delete the post
  const onDelete = useCallback(async () => {
    if (!post._id) return;
    setIsLoading(true);
    try {
      // Call the deletePost API
      const response = await deletePost(post._id);
      if (response && response.success) {
        await syncPostsFromDB(displayDate);
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
        });
        setIsLoading(false);
        setIsOpen(false);
      } else {
        toast({
          title: 'Post cannot be deleted',
          description: 'Failed to delete post',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to save post',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }, [post._id, toast, displayDate]);

  // Generate content with AI
  const onGenerate = useCallback(async (prompt: string) => {
    setIsLoading(true);
    try {
      // For now, we'll use a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockGeneratedContent = `Generated content based on: "${prompt}". This would be replaced with actual AI-generated content.`;
      setPost(prev => ({
        ...prev,
        content: prev.content 
          ? `${prev.content}\n\n${mockGeneratedContent}` 
          : mockGeneratedContent
      }));
      toast({
        title: 'Content Generated',
        description: 'AI-generated content has been added to your post',
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to generate content', error);
      toast({
        title: 'Error',
        description: 'Failed to generate content',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }, [toast]);

  const updatePostHandler = async (
    key: string,
    value: PlatformType[] | string | Date | string[],
  ) => {
    const { livePost, setLivePost } = usePostStore.getState();

    // Skip platform updates as they are now handled at user level
    if (key === 'platform') {
      return;
    }

    try {
      const response = await updatePost(
        {
          ...livePost,
          scheduleDate: livePost.scheduleDate instanceof Date 
            ? livePost.scheduleDate.toISOString() 
            : new Date(livePost.scheduleDate).toISOString(),
          [key]: value,
        },
        livePost._id || ""
      );

      if(response){
        setLivePost({
          ...response.data,
          scheduleDate: new Date(response.data.scheduleDate)
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error)?.message as string,
        variant: "destructive",
      });
    } 
  };

  return {
    isOpen,
    post,
    isLoading,
    onOpen,
    onClose,
    onSave,
    onDelete,
    onGenerate,
    updatePostHandler
  };
};

export default useEditPost;