import { BASE_URL } from '@/commons/constant';
import { doGET, doPOST, doPUT, doDELETE } from '@/commons/serviceUtils';
import axios from 'axios';
import { PostStatus, PostApiDetails } from '@/types/post';
import { PlatformType } from '@/types';

// Interface for get posts filters
interface GetPostsFilters {
  platform?: PlatformType[];
  status?: PostStatus;
  startDate?: string;
  endDate?: string;
}

export const getPosts = async (filters: GetPostsFilters) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Handle multiple platforms
    if (filters.platform) {
      filters.platform.forEach(platform => {
        queryParams.append('platform', platform);
      });
    }
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);

    const response = await doGET(
      `${BASE_URL}/post/user?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
    throw error;
  }
};

export const createPost = async (postData: PostApiDetails) => {
  try {
    const response = await doPOST(
      `${BASE_URL}/post/add`,
      postData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
    throw error;
  }
};

export const updatePost = async (postData: PostApiDetails, postId: string) => {
  try {
    const response = await doPUT(
      `${BASE_URL}/post/update/${postId}`,
      postData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update post');
    }
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await doDELETE(
      `${BASE_URL}/post/delete/${postId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete post');
    }
    throw error;
  }
};