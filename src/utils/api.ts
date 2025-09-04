"use client";

import axios from "axios";
import toast from "react-hot-toast";
// import { safeLocalStorage } from "./localStorage";

const BASE_URLs =
  // "https://staging-branch-khazraai-production.up.railway.app/api/";
  "https://dev-kai-backend-production.up.railway.app/api/";
  // "http://192.168.18.179:4000/api/";

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
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong.";

    toast.error(message); // 🔥 Show toast
    throw new Error(message); // Still throw for catching
  } else {
    toast.error("Unexpected error occurred.");
    throw new Error("Unexpected error occurred.");
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
      return response.data;
    }

    toast.error(`Error ${response.status}: ${response.statusText}`);
    throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
  } catch (error) {
    handleError(error);

    throw error;
  }
};

// const organization = JSON.parse(safeLocalStorage.getItem("user") || "{}");
// const organizationId = organization.organization;

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
    let response;
    const headers = getHeaders(token);
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    if (isFormData) {
      // Let the browser set the multipart boundary automatically
      // Axios will honor this header for FormData payloads
      (headers as any)["Content-Type"] = "multipart/form-data";
    }
    if (method === "delete") {
      // For DELETE requests, headers go in the second parameter
      response = await axios.delete(`${BASE_URLs}${endPoint}`, {
        headers,
        data: data, // DELETE requests can have a body, but it's passed as 'data' in config
      });
    } else {
      // For POST, PUT, PATCH requests
      response = await axios[method](`${BASE_URLs}${endPoint}`, data, { headers });
    }

    if (response.status >= 200 && response.status < 300) {
      // if (dashboard) {
      //   await axios.put(
      //     `${BASE_URLs}dashboard/updateDashboardData/${organizationId}`,
      //     {
      //       recentActivities: response.data,
      //       totalEmissions: scope
      //         ? response.data[scope]?.totalEmissions || 0
      //         : 0,
      //       stationaryCombustionEmissions:
      //         (scope === "stationary" &&
      //           response.data[scope]?.stationaryCombustionEmissions) ||
      //         0,
      //       mobileCombustionEmissions:
      //         (scope === "mobile" &&
      //           response.data[scope]?.mobileCombustionEmissions) ||
      //         0,
      //       previousYearStationaryEmissions: 1746.2,
      //       previousYearMobileEmissions: 1746.2,
      //       currentEmissionYear: scope
      //         ? response.data[scope]?.stationaryCombustionEmissions ||
      //           0 + response.data[scope]?.mobileCombustionEmissions ||
      //           0
      //         : 0,
      //       previousEmissionsYear: 1999,
      //     },
      //     { headers: getHeaders(token) }
      //   );
      // }
      return response.data;
    } else {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
  } catch (error: any) {
    // if (endPoint === "auth/login") {
    handleError(error);
    // }
    throw error;
  }
};
