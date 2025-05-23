import apiHandler from "./apiHandle";
import { API_METHODS } from "./constant";
import { getValue, STORAGE_KEYS } from "./storage";


export const doGET = async function (url:string) {
  try {
    const response = await apiHandler(url, API_METHODS.GET)
    return response;
  } catch (err:any) {
    throw err?.message ?? 'An error occurred during the GET request';
  }
};

export const doPOST = async function (url:String, data:any) {
  try {
    const response = await apiHandler(url, API_METHODS.POST, data)
    return response;
  } catch (err:any) {
    throw err;
  }
};

export const doDELETE = async function (url:string, data?: any) {
  try {
    const response = await apiHandler(url, API_METHODS.DELETE, data)
    return response;
  } catch (err:any) {
    throw err;
  }
};

export const doPUT = async function (url:String, data:any) {
  try {
    const response = await apiHandler(url, API_METHODS.PUT, data)
    return response;
  } catch (err:any) {
    throw err;
  }
}

