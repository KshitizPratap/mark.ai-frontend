import { PlatformType } from "./post";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "system";
  timestamp: Date;
}

export interface AyrsharePlatformDetails {
  label: string;
  value: string;
  isConnected: boolean;
  isEnabled: boolean;
  icon?: any;
  img?: any;
}

export type PlatformName =
  | "Instagram"
  | "Facebook"
  | "TikTok"
  | "X/Twitter"
  | "Reddit"
  | "Telegram"
  | "Threads"
  | "YouTube"
  | "Bluesky"
  | "Google Business";

export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  plan: string;
  status: string;
  _id: string;
}

export interface PostType {
  id: "post" | "story" | "reel";
  label: string;
}

export interface UserCredential {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
  agreeToTerms?: boolean;
}

export type AyrShareSocialHandles = {
  [key in PlatformType]: boolean;
}