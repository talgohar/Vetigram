import axios, { CanceledError } from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;
console.log("backend_url", import.meta.env);
const baseImagesUrl = `${backend_url}/public`;

const apiClient = axios.create({
  baseURL: backend_url,
});
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const imagesClient = axios.create({

  baseURL: baseImagesUrl,
});

export { CanceledError, apiClient, imagesClient, baseImagesUrl };