import axios from "axios";
import { User } from "@/types";
import { LoginRequest, SignUpRequest } from "@/types/requestTypes";
import { BASE_URL } from "@/commons/constant";
import { doGET, doPOST } from "@/commons/serviceUtils";
import { usePostStore } from '@/store/usePostStore';
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
    console.log(50, livePost);
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
    await createDummyLivePost();
    return response.data.data.user;
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
    await createDummyLivePost();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
};
