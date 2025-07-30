import axios from "axios";
import toast from "react-hot-toast";

const BASE_URLs =
  "https://dev-kai-backend-production.up.railway.app/api/";
  // "http://localhost:4001/api/v1/";

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

export const postRequest = async (
  endPoint: string,
  data: any,
  successMessage?: string,
  token?: string,
  method: "post" | "patch" = "post"
) => {
  try {
    console.log("base url", BASE_URLs + endPoint);

    const response = await axios[method](`${BASE_URLs}${endPoint}`, data, {
      headers: getHeaders(token),
    });
    console.log(response.data);
    if (response.status >= 200 && response.status < 300) {
      console.log("post request whole response.", response);
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
