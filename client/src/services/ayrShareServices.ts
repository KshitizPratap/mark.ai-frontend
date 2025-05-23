import { BASE_URL } from '@/commons/constant';
import { doPOST } from '@/commons/serviceUtils';
import { GenerateAyrshareTokenResponse } from '@/types/requestTypes';
import axios from 'axios';

export const generateAyrshareToken = async () => {
    try {
        const response = await doPOST(
            `${BASE_URL}/ayrshare/profile-connection-url`,
            {}
        );

        return response.data.data as GenerateAyrshareTokenResponse;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch posts');
        }
        throw error;
    }
};