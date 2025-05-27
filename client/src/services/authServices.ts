import axios from "axios";
import { User } from "@/types";
import { LoginRequest, SignUpRequest } from "@/types/requestTypes";
import { BASE_URL } from "@/commons/constant";
import { doGET, doPOST } from "@/commons/serviceUtils";
import { usePostStore } from '@/store/usePostStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createPost } from './postServices';
import { setValue, STORAGE_KEYS } from '@/commons/storage';

interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}

export const createDummyLivePost = async () => {
  const postStore = usePostStore.getState();
  const currentTime = new Date();
  
  const livePost = {
    ...postStore.livePost,
    scheduleDate: currentTime
  };
  
  const postForDB = {
    ...livePost,
    scheduleDate: currentTime.toISOString()
  };
  
  postStore.setLivePost(livePost);
  
  try {
    let livePost = await createPost(postForDB);
    livePost = livePost.data;
    postStore.setLivePost({
      ...livePost,
      scheduleDate: new Date(livePost.scheduleDate)
    });
  } catch (error) {
    console.error('Failed to create live post:', error);
  }
};

export const verifyToken = async () : Promise<User>=> {
  try {
    const response = await doGET(`${BASE_URL}/auth/me`);
    
    useAuthStore.getState().setTimeZoneLabel(detectUserTimezone());
    
    await createDummyLivePost();
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
    throw error;
  }
};

export const handleSignUp = async (
  userData: SignUpRequest
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${BASE_URL}/auth/signup`,
      userData
    );
    setValue(STORAGE_KEYS.TOKEN, response.data.data.token);
    
    useAuthStore.getState().setTimeZoneLabel(detectUserTimezone());
    
    await createDummyLivePost();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
    throw error;
  }
};

export const handleLogin = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${BASE_URL}/auth/login`,
      credentials
    );
    setValue(STORAGE_KEYS.TOKEN, response.data.data.token);
    
    useAuthStore.getState().setTimeZoneLabel(detectUserTimezone());
    
    await createDummyLivePost();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
};

const detectUserTimezone = (): string => {
  try {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset <= 0 ? '+' : '-';
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error detecting timezone:', error);
    return 'GMT+00:00';
  }
};
