import { BASE_URL } from '@/commons/constant';
import { doPOST } from '@/commons/serviceUtils';
import { ChatRequest, ChatResponse } from '@/types/requestTypes';
import axios from 'axios';

export const chatWithMark = async (data: ChatRequest): Promise<ChatResponse> => {
    try {
        const response = await doPOST(
            `${BASE_URL}/chat/send`,
            data
        );
        return response.data.text;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch posts');
        }
        throw error;
    }
};