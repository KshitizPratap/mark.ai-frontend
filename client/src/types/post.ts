import { PlatformType, SupportedPostType } from ".";
export interface PostUser {
  id: string | number;
  avatarUrl: string;
  name?: string;
}

export type PostStatus = 'draft' | 'schedule' | 'live' | 'published' | 'deleted';

export interface Post {
  _id?: string;
  userId?: string | Record<string, any>;
  title: string;
  content: string;
  hashtag: string;
  mediaUrl: string[];
  platform: PlatformType[];
  postType: SupportedPostType | string;
  status: PostStatus;
  scheduleDate: Date;
  publish?: string;
  createdAt?: string;
}

export interface PostApiDetails {
  title?: string;
  content?: string;
  hashtag?: string;
  mediaUrl?: string[];
  platform?: PlatformType[];
  postType?: string;
  status?: PostStatus;
  scheduleDate?: string;
}

export type CalendarView = 'month' | 'week';
