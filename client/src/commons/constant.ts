import { MessageType } from "@/components/ChatInterface";
import { AyrsharePlatformDetails, PostType, PlatformType } from "@/types";
import { SocialIconComponents } from "@/assets/icons/social/SocialIcons";

// export const BASE_URL = "http://localhost:5000";
export const BASE_URL = 'https://mark-ai-backend-1057029383450.asia-south2.run.app';

export const ENABLE_AI_GENERATE = false;

export const ENABLE_ANALYTICS = false;

export const AYRSHARE = "ayrshare";

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT",
};
  

export const postTypes: PostType[] = [
  {
      id: 'post',
      label: 'Post'
  },
  {
      id: 'story',
      label: 'Story'
  },
  {
      id: 'reel',
      label: 'Reel'
  }
];

export const initialMessages: MessageType[] = [
  {
    id: '1',
    text: '👋 Hi! I\'m Mark, your potential social media manager.',
    sender: 'system',
  },
  {
    id: '2',
    text: 'I\'d love to learn about your business and social media goals.',
    sender: 'system',
  },
  {
    id: '3',
    text: 'What\'s your biggest social media challenge right now?',
    sender: 'system',
  }
];

export const platformsRow1: { name: PlatformType; icon: string }[] = [
  { name: "instagram", icon: "I" },
  { name: "twitter", icon: "X" },
  { name: "threads", icon: "@" },
  { name: "facebook", icon: "f" },
];

export const initialiseChatWithMark = "This is the system message. The user is online. Send greetings and provide 1 liner update. DO NOT mention anything about system. Just greet the user."

export const initialSocialPlatforms: AyrsharePlatformDetails[] = [
  {
    label: "Bluesky",
    value: "bluesky",
    isConnected: false,
    isEnabled: false,
    img: SocialIconComponents.bluesky
  },
  {
    label: "Facebook",
    value: "facebook",
    isConnected: false,
    isEnabled: true,
    img: SocialIconComponents.facebook
  },
  {
    label: "Gmb",
    value: "gmb",
    isConnected: false,
    isEnabled: false,
    img: ""
  },
  {
    label: "Instagram",
    value: "instagram",
    isConnected: true,
    isEnabled: true,
    img: SocialIconComponents.instagram
  },
  {
    label: "Linkedin",
    value: "linkedin",
    isConnected: true,
    isEnabled: true,
    img: SocialIconComponents.linkedin
  },
  {
    label: "Pinterest",
    value: "pinterest",
    isConnected: false,
    isEnabled: false,
    img: SocialIconComponents.pinterest
  },
  {
    label: "Reddit",
    value: "reddit",
    isConnected: false,
    isEnabled: false,
    img: SocialIconComponents.reddit
  },
  {
    label: "Telegram",
    value: "telegram",
    isConnected: false,
    isEnabled: false,
    img: SocialIconComponents.telegram
  },
  {
    label: "Threads",
    value: "threads",
    isConnected: true,
    isEnabled: true,
    img: SocialIconComponents.threads
  },
  {
    label: "Tiktok",
    value: "tiktok",
    isConnected: false,
    isEnabled: false,
    img: SocialIconComponents.tiktok
  },
  {
    label: "Twitter",
    value: "twitter",
    isConnected: false,
    isEnabled: true,
    img: SocialIconComponents.twitter
  },
  {
    label: "Youtube",
    value: "youtube",
    isConnected: false,
    isEnabled: false,
    img: SocialIconComponents.youtube
  }
];