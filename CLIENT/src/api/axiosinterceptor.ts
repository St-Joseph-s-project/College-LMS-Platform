import axios from "axios";
import { JWT_TOKEN_NAME } from "../constants/appConstants";
import { store } from "../redux/store";
import { setJWTToken, clearJWTToken } from "../redux/features/jwtSlice";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  originalRequest: any;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) {
      reject(error);
    } else if (token) {
      // Update the original request with new token
      originalRequest.headers.Authorization = `Bearer ${token}`;
      // Resolve with axios instance directly, allowing complete promise chain to process
      resolve(instance(originalRequest));
    } else {
      reject(new Error('No token available'));
    }
  });

  // Clear the queue after processing
  failedQueue = [];
};

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(JWT_TOKEN_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Return a new promise that will resolve/reject based on the refresh outcome
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await refreshInstance.get(
          "/auth/check-refresh-token"
        );

        // Extract the token from response data using various possible formats
        let newAccessToken = null;

        if (refreshResponse.data) {
          // Try different possible response formats
          if (refreshResponse.data.accessToken) {
            newAccessToken = refreshResponse.data.accessToken;
          } else if (refreshResponse.data.token) {
            newAccessToken = refreshResponse.data.token;
          } else if (refreshResponse.data.data && refreshResponse.data.data.accessToken) {
            newAccessToken = refreshResponse.data.data.accessToken;
          } else if (typeof refreshResponse.data === 'string') {
            // In case the token is returned directly as a string
            newAccessToken = refreshResponse.data;
          }
        }

        if (newAccessToken) {
          sessionStorage.setItem(JWT_TOKEN_NAME, newAccessToken);

          store.dispatch(
            setJWTToken({
              jwtToken: newAccessToken,
            })
          );

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          isRefreshing = false;

          return instance(originalRequest);
        } else {
          throw new Error(`Invalid refresh response format: ${JSON.stringify(refreshResponse.data)}`);
        }
      } catch (refreshError: any) {
        // Clear authentication data
        sessionStorage.removeItem(JWT_TOKEN_NAME);
        store.dispatch(clearJWTToken());

        processQueue(refreshError, null);
        isRefreshing = false;

        // Provide more context in the error
        const errorMessage = refreshError.response?.data?.message ||
          refreshError.message ||
          "Failed to refresh authentication token";

        return Promise.reject(new Error(errorMessage));
      }
    }

    return Promise.reject(error);
  }
);

export default instance;