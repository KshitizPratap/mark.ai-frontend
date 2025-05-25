import axios from "axios";
import {API_METHODS, BASE_URL} from "./constant";
import { useAuthStore } from "@/store/useAuthStore";
import { getValue, removeValue, STORAGE_KEYS } from "./storage";

export const api = axios.create({
    baseURL: BASE_URL
});

const isFormData = (value: unknown): value is FormData => value instanceof FormData;

const apiHandler = async (endPoint: any, method: string, data = null) => {
    try {
        const contentType: string = isFormData(data) ? "multipart/form-data" : "application/json";
        const token = getValue(STORAGE_KEYS.TOKEN);
        
        const response = await api({
            method: method,
            url: endPoint,
            ...(![API_METHODS.GET, API_METHODS.DELETE].includes(method) && { data: data }),
            headers: {
                "Content-Type": contentType,
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        });

        return { error: false, message: "", status: response?.status, data: response?.data };
    } catch (error: any) {
        // Default error message
        let errorMessage = 'An error occurred.';
        let statusCode = 500;

        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
            statusCode = error.response.status;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        // // Handle 401 Unauthorized error
        // if (statusCode === 401) {
        //     removeValue(STORAGE_KEYS.TOKEN);
            
        //     const logout = useAuthStore.getState().logout;
        //     logout();
            
        //     window.location.href = '/';
        //     errorMessage = 'Session expired. Please login again.';
        // }

        throw new Error(error.response?.data?.message || 'Facing some technical issue, please try after some time');
    }
};

export default apiHandler;