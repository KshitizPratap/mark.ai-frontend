import { Post, PostStatus, PlatformType } from '@/types/post';

// Sample media URLs
const mediaUrls = [
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100&h=100',
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=100&h=100',
  'https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=100&h=100',
  'https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&w=100&h=100',
];

// Sample hashtags
const hashtags = [
  '#socialmedia',
  '#marketing',
  '#digital',
  '#content',
  '#strategy',
  '#branding',
  '#growth',
  '#engagement'
];

// All available platforms
const allPlatforms: PlatformType[] = [
  'bluesky',
  'facebook',
  'gmb',
  'instagram',
  'linkedin',
  'pinterest',
  'reddit',
  'telegram',
  'threads',
  'tiktok',
  'twitter',
  'youtube',
];

// Generate a random time on a given date
const getRandomTime = (date: Date, startHour = 8, endHour = 20) => {
  const randomHour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const randomMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes
  const newDate = new Date(date);
  newDate.setHours(randomHour, randomMinute);
  return newDate;
};

// Generate random platforms array
const generateRandomPlatforms = (): PlatformType[] => {
  return allPlatforms.filter(() => Math.random() > 0.7); // ~30% chance for each
};

// Generate random posts for the current month
export const generateMockPosts = (date: Date, count = 30): Post[] => {
  const posts: Post[] = [];
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  for (let i = 0; i < count; i++) {
    const monthOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    const targetMonth = currentMonth + monthOffset;
    const day = Math.floor(Math.random() * 28) + 1;
    const postDate = new Date(currentYear, targetMonth, day);
    const status: PostStatus = Math.random() > 0.3 ? 'schedule' : 'draft';
    const scheduleDate = getRandomTime(postDate);
    const mediaCount = Math.floor(Math.random() * 3);
    const selectedMedia = mediaUrls
      .sort(() => Math.random() - 0.5)
      .slice(0, mediaCount);
    const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
    const platforms = generateRandomPlatforms();
    const post: Post = {
      _id: `post-${i}`,
      userId: `user-${Math.floor(Math.random() * 10)}`,
      title: `Post ${i + 1}`,
      content: `This is the content for post ${i + 1}. ${hashtag}`,
      hashtag,
      mediaUrl: selectedMedia,
      platform: platforms,
      postType: 'post',
      status,
      scheduleDate,
      publish: '',
      platformId: undefined,
      createdAt: new Date(),
      ayrshareId: '',
    };
    posts.push(post);
  }
  return posts;
};
