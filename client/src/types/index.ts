export interface Message {
  id: string;
  text: string;
  sender: "user" | "system";
  timestamp: Date;
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

export interface AyrsharePlatformDetails {
  label: string;
  value: PlatformType;
  isConnected: boolean;
  isEnabled: boolean;
  img?: any;
}

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
