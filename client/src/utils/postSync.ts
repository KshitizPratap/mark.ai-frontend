import { toast } from '@/hooks/use-toast';
import { getPosts } from '@/services/postServices';
import { usePostStore } from '@/store/usePostStore';

// Utility to fetch posts from API and update Zustand store
export async function syncPostsFromDB(centerDate?: Date) {
  const setPosts = usePostStore.getState().setPosts;
  const today = centerDate || new Date();
  try {
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 1);
    const startDateStr = startDate.toISOString().slice(0, 10);
    const endDateStr = endDate.toISOString().slice(0, 10);
    const response = await getPosts({
      startDate: startDateStr,
      endDate: endDateStr
    });
    if (response && response.success && response.data && response.data.data && response.data.data.length > 0) {
      const parsedPosts = response.data.data.map((post: any) => ({
        ...post,
        scheduleDate: post.scheduleDate ? new Date(post.scheduleDate) : undefined,
        createdAt: post.createdAt ? new Date(post.createdAt) : undefined,
      }));
      setPosts(parsedPosts);
    } else {
      console.log('No posts found.');
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch posts.',
      variant: 'destructive'
    });
  }
} 