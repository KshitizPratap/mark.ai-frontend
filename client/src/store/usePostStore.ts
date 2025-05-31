import { create } from 'zustand';
import { Message } from '@/types';
import { Post, PostStatus } from '@/types/post';
import { getChatHistory, transformChatHistoryToMessages } from '@/services/chatServices';

interface PostState {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  loadChatHistory: () => Promise<void>;
  isThinking: boolean;
  setIsThinking: (isThinking: boolean) => void;

  livePost:Post;
  setLivePost: (postState: Partial<PostState['livePost']>) => void;
  resetLivePost: () => void;

  posts: Post[];
  setPosts: (posts: Post[]) => void;

  displayDate: Date;
  setDisplayDate: (date: Date) => void;

  resetPostState: () => void;
}

const initialState = {
  messages: [],
  isThinking: false,
  livePost: {
    title: "Welcome to Mark.ai",
    content: "This is your social media post. Edit it to get started!",
    hashtag: "#welcome",
    mediaUrl: [],
    platform: [],
    postType: "",
    scheduleDate: new Date(),
    status: "live" as PostStatus,
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

  loadChatHistory: async () => {
    try {
      const chatHistoryResponse = await getChatHistory();
      const transformedMessages = transformChatHistoryToMessages(chatHistoryResponse);
      set({ messages: transformedMessages });
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Optionally set an error state or show a notification
    }
  },

  // Post state actions
  setLivePost: (newPostState) => set((state) => ({
    livePost: { ...state.livePost, ...newPostState }
  })),

  setPosts: (posts) => set({ posts }),

  setDisplayDate: (date) => set({ displayDate: date }),

  // Reset all post state
  resetPostState: () => set(initialState),

  resetLivePost: () => {
    set((state) => ({
      livePost: { ...initialState.livePost }
    }));
  },
}));

export const resetPostState = usePostStore.getState().resetPostState;
export const resetLivePost = usePostStore.getState().resetLivePost;
