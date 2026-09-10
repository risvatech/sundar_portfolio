import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;

  if (siteId) {
    config.headers["x-site-id"] = siteId;
  }
  return config;
});

export default api;
