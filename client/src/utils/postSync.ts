import { toast } from '@/hooks/use-toast';
import { getPosts } from '@/services/postServices';
import { usePostStore } from '@/store/usePostStore';
import { Post } from '@/types/post';

// Function to get date range based on center date
const getDateRange = (centerDate?: Date) => {
  const today = centerDate || new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 1);
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 1);
  
  // date: "2025-04-20"
  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10)
  };
};

// Reusable function to fetch and process posts
export const syncPostsByDateRange = async (startDate: string, endDate: string): Promise<Post[]> => {
  try {
    const response = await getPosts({ startDate, endDate });
    if (response?.success && response?.data?.data?.length > 0) {
      const parsedPosts = response.data.data.map((post: any) => ({
        ...post,
        scheduleDate: post.scheduleDate ? new Date(post.scheduleDate) : undefined
      }));
      return parsedPosts;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch posts.',
      variant: 'destructive'
    });
    return [];
  }
};

export const syncPostsFromDB = async (centerDate?: Date): Promise<Post[]> => {
  const { startDate, endDate } = getDateRange(centerDate);
  const posts = await syncPostsByDateRange(startDate, endDate);
  usePostStore.getState().setPosts(posts);
  return posts;
}; 