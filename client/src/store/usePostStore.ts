import { create } from 'zustand';
import { Message } from '@/types';
import { Post, PlatformType } from '@/types/post';

interface PostState {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  isThinking: boolean;
  setIsThinking: (isThinking: boolean) => void;

  createPost: {
    _id?: string;
    title: string;
    content: string;
    hashtag: string;
    mediaUrl: string[];
    platform: PlatformType[];
    postType: string;
    scheduleDate: Date;
  };
  setCreatePost: (postState: Partial<PostState['createPost']>) => void;

  posts: Post[];
  setPosts: (posts: Post[]) => void;

  displayDate: Date;
  setDisplayDate: (date: Date) => void;

  resetPostState: () => void;
}

const initialState = {
  showSignUpPrompt: false,
  messageCount: 0,
  messages: [],
  isThinking: false,
  createPost: {
    title: "",
    content: "",
    hashtag: "",
    mediaUrl: [],
    platform: [],
    postType: 'post',
    scheduleDate: new Date(),
  },
  posts: [],
  displayDate: new Date(),
};

export const usePostStore = create<PostState>((set) => ({
  ...initialState,
  setMessages: (messages) => set((state) => ({
    messages: typeof messages === 'function' ? messages(state.messages) : messages
  })),
  setIsThinking: (isThinking) => set({ isThinking }),

  // Post state actions
  setCreatePost: (newPostState) => set((state) => ({
    createPost: { ...state.createPost, ...newPostState }
  })),

  setPosts: (posts) => set({ posts }),

  setDisplayDate: (date) => set({ displayDate: date }),

  // Reset all post state
  resetPostState: () => set(initialState),
}));

export const resetPostState = usePostStore.getState().resetPostState;
