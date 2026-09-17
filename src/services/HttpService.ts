import type { AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";

class HttpService {

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const config: AxiosRequestConfig = params ? { params } : {};
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  }

  // For file downlods (blob responce)
  async getBlob(url: string): Promise<Blob> {
    const response = await axiosInstance.get(url, { responseType: "blob" });
    return response.data as Blob;
  }
}

export default new HttpService();