import { BASE_URL } from "@/commons/constant";
import { doGET, doPOST } from "@/commons/serviceUtils";
import { AyrShareSocialHandles, PlatformName } from "@/types";
import { GenerateAyrshareTokenResponse } from "@/types/requestTypes";
import axios from "axios";

export const generateAyrshareToken = async (platforms: PlatformName[]) => {
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

export const getAyrshareSocialHandles = async (): Promise<PlatformName[]> => {
  try {
    const response = await doGET(
      `${BASE_URL}/ayrshare/ayrshare-connected-platforms`
    );

    return response.data.data?.profiles?.[0]?.activeSocialAccounts || [] as PlatformName[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch posts");
    }
    throw error;
  }
};
