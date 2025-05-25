import { BASE_URL } from "@/commons/constant";
import { doPOST } from "@/commons/serviceUtils";
import axios from "axios";

export const uploadSingleMedia = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('mediaFile', file);

      const response = await doPOST(
        `${BASE_URL}/upload/single`,
        formData
      );
      return response.data.data?.[0]?.cloudinaryUrl || "";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create post');
      }
      throw error;
    }
  };
  