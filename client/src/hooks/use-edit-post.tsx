import { useState, useCallback } from 'react';
import { Post } from '@/types/post';
import { useToast } from '@/hooks/use-toast';
import { deletePost, updatePost, createPost } from '@/services/postServices';
import { syncPostsFromDB } from '@/utils/postSync';
import { usePostStore } from '@/store/usePostStore';

// Define the empty/default post structure
const DEFAULT_POST: Post = {
  _id: undefined,
  userId: '',
  title: '',
  content: '',
  hashtag: '',
  mediaUrl: [],
  platform: [],
  postType: 'post',
  status: 'draft',
  scheduleDate: new Date(),
  publish: '',
  platformId: undefined,
  createdAt: new Date(),
  ayrshareId: '',
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
        title: updatedPost.title,
        content: updatedPost.content,
        platform: updatedPost.platform,
        status: updatedPost.status,
        hashtag: updatedPost.hashtag,
        mediaUrl: updatedPost.mediaUrl,
        postType: updatedPost.postType,
        scheduleDate: updatedPost.scheduleDate.toISOString(),
        publish: 'true',
        ayrshareId: updatedPost.ayrshareId || '',
        platformId: updatedPost.platformId
      }, updatedPost._id || '');

      if (!response?.success) {
        throw new Error('Failed to save post');
      }

      toast({
        title: 'Success',
        description: updatedPost.status === 'schedule' ? 'Post scheduled successfully!' : 'Post saved as draft!',
      });
      
      await syncPostsFromDB(displayDate);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save post:', error);
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive',
      });
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
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
        });
        await syncPostsFromDB(displayDate);
        setIsLoading(false);
        setIsOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete post',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to delete post', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
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

  return {
    isOpen,
    post,
    isLoading,
    onOpen,
    onClose,
    onSave,
    onDelete,
    onGenerate
  };
};

export default useEditPost;