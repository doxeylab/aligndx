import http from "../http-common";
// eslint-disable-next-line
import axios from "axios";


const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const getFiles = () => {
  return http.get("/files");
};
// eslint-disable-next-line
export default {
  upload,
  getFiles,
};