import axios from "axios";
import { environment } from "../environment";
import StorageService from "./StorageService";

const axiosInstance = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = StorageService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      StorageService.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;