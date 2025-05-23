import { format, parseISO, startOfDay, addHours, isSameDay, isSameHour } from 'date-fns';
import { Post } from '@/types/post';

// Type for the preprocessed posts map
export type PostsByDateTime = Map<string, Post[]>;

/**
 * Generates a unique key for a date and hour combination
 * Format: YYYY-MM-DD-HH
 */
export const generateDateTimeKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd-HH');
};

/**
 * Preprocesses posts into a Map for O(1) lookup
 * Handles timezone conversion and groups posts by date and hour
 */
export const preprocessPosts = (posts: Post[]): PostsByDateTime => {
  const postsMap = new Map<string, Post[]>();

  posts.forEach(post => {
    // Ensure we're working with a proper Date object
    const postDate = post.scheduleDate instanceof Date 
      ? post.scheduleDate 
      : parseISO(post.scheduleDate as unknown as string);

    // Generate the key for this post's date and hour
    const key = generateDateTimeKey(postDate);

    // Get or create the array for this date-time slot
    const existingPosts = postsMap.get(key) || [];
    postsMap.set(key, [...existingPosts, post]);
  });

  return postsMap;
};

/**
 * Gets posts for a specific day and hour
 * Returns an empty array if no posts exist for that time slot
 */
export const getPostsForDateTime = (
  postsMap: PostsByDateTime,
  date: Date,
  hour: number
): Post[] => {
  const targetDate = addHours(startOfDay(date), hour);
  const key = generateDateTimeKey(targetDate);
  return postsMap.get(key) || [];
};

/**
 * Gets all posts for a specific day
 * Returns an array of all posts scheduled for that day
 */
export const getPostsForDay = (
  postsMap: PostsByDateTime,
  date: Date
): Post[] => {
  const dayPosts: Post[] = [];
  
  // Check all hours of the day
  for (let hour = 0; hour < 24; hour++) {
    const key = generateDateTimeKey(addHours(startOfDay(date), hour));
    const postsForHour = postsMap.get(key) || [];
    dayPosts.push(...postsForHour);
  }
  
  return dayPosts;
};

/**
 * Checks if two posts overlap in time
 * Used for positioning posts in the week view
 */
export const doPostsOverlap = (post1: Post, post2: Post): boolean => {
  const date1 = post1.scheduleDate;
  const date2 = post2.scheduleDate;
  
  return isSameDay(date1, date2) && isSameHour(date1, date2);
}; 