import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

export const setupAxiosInterceptors = () => {
  // Request interceptor - Tự động thêm Authorization header
  axios.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      
      // Nếu có accessToken, thêm vào header
      if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Xử lý token hết hạn
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthStore();

      // Nếu lỗi 401 và chưa retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Nếu đang refresh, đợi trong queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Thử refresh token
          const newToken = await authStore.refreshAccessToken();
          
          // Update header của request ban đầu
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process queue
          processQueue(null, newToken);
          
          // Retry request ban đầu
          return axios(originalRequest);
        } catch (refreshError) {
          // Nếu refresh fail, logout và redirect
          processQueue(refreshError, null);
          await authStore.logout();
          
          // Redirect về login nếu không phải đang ở trang login/register
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
