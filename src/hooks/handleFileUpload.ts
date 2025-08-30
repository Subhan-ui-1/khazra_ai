import { postRequest } from "../utils/api";
import { safeLocalStorage } from "../utils/localStorage";

export const handleFileUpload = () => {
  const getToken = () => {
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };
  const handleBulkUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await postRequest(
      "upload-attachment/uploadAttachment",
      formData,
      "",
      getToken() as string,
      "post"
    );
    if (response.success) {
      return response;
    }
    return null;
  };
  return {handleBulkUpload};
};
