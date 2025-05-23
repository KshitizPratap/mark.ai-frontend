export interface PostUser {
  id: string | number;
  avatarUrl: string;
  name?: string;
}

export type PlatformType =
  | "bluesky"
  | "facebook"
  | "gmb"
  | "instagram"
  | "linkedin"
  | "pinterest"
  | "reddit"
  | "telegram"
  | "threads"
  | "tiktok"
  | "twitter"
  | "youtube";

export type PostStatus = 'draft' | 'schedule' | 'public' | 'published' | 'deleted';

export interface Post {
  _id?: string;
  userId: string | Record<string, any>;
  title: string;
  content: string;
  hashtag: string;
  mediaUrl: string[];
  platform: PlatformType[];
  postType: string;
  status: PostStatus;
  scheduleDate: Date;
  publish: string;
  platformId?: string;
  createdAt: Date;
  ayrshareId: string;
}

export type CalendarView = 'month' | 'week';
