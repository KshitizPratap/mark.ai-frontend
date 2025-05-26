import { create } from 'zustand';
import { User, AyrsharePlatformDetails } from '@/types';
import { removeValue, STORAGE_KEYS } from '@/commons/storage';
import { resetPostState } from './usePostStore';
import { initialSocialPlatforms } from '@/commons/constant';

interface PostState {
  isAuth: boolean | null;
  userDetails?: User;
  isOpen: boolean;
  view: 'signin' | 'signup';
  token?: string;
  isVerifying: boolean;
  timeZoneLabel: string;
  socialPlatforms: AyrsharePlatformDetails[];
  
  setIsAuth: (isAuth: boolean) => void;
  setUserDetails: (userDetails: User) => void;
  setIsOpen: (isOpen: boolean) => void;
  setView: (view: 'signin' | 'signup') => void;
  setToken: (token: string) => void;
  setIsVerifying: (isVerifying: boolean) => void;
  setTimeZoneLabel: (timeZoneLabel: string) => void;
  updatePlatformConnection: (value: string, isConnected: boolean) => void;
  getEnabledPlatforms: () => AyrsharePlatformDetails[];
  getConnectedPlatforms: () => AyrsharePlatformDetails[];
  logout: () => void;
}

export const useAuthStore = create<PostState>((set, get) => ({
  isAuth: null,
  userDetails: undefined,
  isOpen: false,
  view: 'signin',
  token: undefined,
  isVerifying: false,
  timeZoneLabel: 'GMT+00:00',
  socialPlatforms: initialSocialPlatforms,

  setIsAuth: (isAuth: boolean) => set({isAuth}),
  setUserDetails: (userDetails: User) => set({userDetails}),
  setIsOpen: (isOpen: boolean) => set({isOpen}),
  setView: (view) => set({ view }),
  setToken: (token: string) => set({token}),
  setIsVerifying: (isVerifying: boolean) => set({isVerifying}),
  setTimeZoneLabel: (timeZoneLabel: string) => set({timeZoneLabel}),
  updatePlatformConnection: (value: string, isConnected: boolean) => set((state) => ({
    socialPlatforms: state.socialPlatforms.map((platform) =>
      platform.value === value ? { ...platform, isConnected } : platform
    )
  })),
  getEnabledPlatforms: () => get().socialPlatforms.filter((platform) => platform.isEnabled),
  getConnectedPlatforms: () => get().socialPlatforms.filter((platform) => platform.isEnabled && platform.isConnected),
  logout: () => {
    set({isAuth: false});
    removeValue(STORAGE_KEYS.TOKEN);
    resetPostState();
  }
}));
