'use client'

import axios from "axios";
import toast from "react-hot-toast";
import { safeLocalStorage } from "./localStorage";

const BASE_URLs =
  "https://dev-kai-backend-production.up.railway.app/api/";
  // "http://192.168.18.140:4000/api/";

const getHeaders = (token?: string) => {
  const headers = {
    authorization: "",
  };
  if (token) {
    headers.authorization = `${token}`;
  }
  return headers;
};

const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.message || "Request failed.";
    console.log(errorMessage);
    console.error(
      "Axios Error:",
      error.response?.data.message || error.message
    );
    throw new Error(error.response?.data.message);
  } else {
    console.error("Unexpected Error:", error);
  }
};

export const getRequest = async (
  endPoint: string,
  token?: string,
  success?: string
) => {
  try {
    const headers = getHeaders(token);
    const response = await axios.get(BASE_URLs + endPoint, { headers });
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data);
      return response.data;
    }

    toast.error(`Error ${response.status}: ${response.statusText}`);
    throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
  } catch (error) {
    handleError(error);

    throw error;
  }
};

const organization = JSON.parse(safeLocalStorage.getItem("user") || "{}");
const organizationId = organization.organization;

export const postRequest = async (
  endPoint: string,
  data: any,
  successMessage?: string,
  token?: string,
  method: "post" | "patch" | "delete" | "put" = "post",
  dashboard: boolean = false,
  scope?: "stationary" | "mobile" | "purchasedElectricity"
) => {
  try {
    console.log("base url", BASE_URLs + endPoint);
    console.log("data", data, getHeaders(token), method);

    let response;
    if (method === "delete") {
      // For DELETE requests, headers go in the second parameter
      response = await axios.delete(`${BASE_URLs}${endPoint}`, {
        headers: getHeaders(token),
        data: data, // DELETE requests can have a body, but it's passed as 'data' in config
      });
    } else {
      // For POST, PUT, PATCH requests
      response = await axios[method](`${BASE_URLs}${endPoint}`, data, {
        headers: getHeaders(token),
      });
    }

    console.log(response.data);
    if (response.status >= 200 && response.status < 300) {
      console.log("post request whole response.", response);
      if (dashboard) {
        await axios.put(
          `${BASE_URLs}dashboard/updateDashboardData/${organizationId}`,
          {
            recentActivities: response.data,
            totalEmissions: scope
              ? response.data[scope]?.totalEmissions || 0
              : 0,
          },
          { headers: getHeaders(token) }
        );
      }
      return response.data;
    } else {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
  } catch (error: any) {
    if (endPoint === "auth/login") {
      handleError(error);
    }
    throw error;
  }
};
