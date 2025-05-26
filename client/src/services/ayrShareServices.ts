import { BASE_URL } from "@/commons/constant";
import { doGET, doPOST } from "@/commons/serviceUtils";
import { PlatformType } from "@/types";
import { GenerateAyrshareTokenResponse } from "@/types/requestTypes";
import axios from "axios";

export const generateAyrshareToken = async (platforms: PlatformType[]) => {
  try {
    const response = await doPOST(
      `${BASE_URL}/ayrshare/profile-connection-url`,
      { platforms }
    );

    return response.data.data as GenerateAyrshareTokenResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch posts");
    }
    throw error;
  }
};

export const getAyrshareSocialHandles = async (): Promise<any> => {
  try {
    const response = await doGET(
      `${BASE_URL}/ayrshare/ayrshare-connected-platforms`
    );
    const data =  response.data;

    if(data?.success && data?.data) {
      return data.data;
    }
    return {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch posts");
    }
    throw error;
  }
};
