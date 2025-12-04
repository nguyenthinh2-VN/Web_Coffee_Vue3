import { defineStore } from 'pinia';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '@/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Ghi chú: Khởi tạo trạng thái từ localStorage để giữ đăng nhập sau khi refresh
    isLoggedIn: !!localStorage.getItem('accessToken'),
    returnUrl: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  actions: {
    async login(username, password) {
      try {
        console.log('authStore.login called with:', { username });
        
        const response = await axios.post(getApiUrl(API_ENDPOINTS.LOGIN), {
          username,
          password
        });

        const { data } = response.data;
        
        if (!data || !data.accessToken || !data.user) {
          throw new Error('Invalid response from server');
        }

        // Lưu tokens và user info
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.user = data.user;
        this.isLoggedIn = true;
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Login successful:', { username: data.user.username });
        return data;
      } catch (error) {
        console.error('Login failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.';
        throw new Error(errorMessage);
      }
    },
    async register({ username, email, password, confirmPassword }) {
      try {
        console.log('authStore.register called with:', { username, email });
        
        const response = await axios.post(getApiUrl(API_ENDPOINTS.REGISTER), {
          username,
          email,
          password,
          confirmPassword
        });

        const { data } = response.data;
        
        if (!data || !data.username) {
          throw new Error('Invalid response from server');
        }

        console.log('Register successful:', { username: data.username });
        return data;
      } catch (error) {
        console.error('Register failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        throw new Error(errorMessage);
      }
    },
    async logout() {
      try {
        console.log('authStore.logout called');
        
        // Gọi API logout nếu có token
        if (this.accessToken) {
          await axios.post(getApiUrl(API_ENDPOINTS.LOGOUT), {}, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          });
        }
      } catch (error) {
        console.error('Logout API call failed:', error.message);
        // Vẫn tiếp tục logout ở client dù API fail
      } finally {
        // Clear state và localStorage
        this.isLoggedIn = false;
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        this.returnUrl = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },
    
    async refreshAccessToken() {
      try {
        if (!this.refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(getApiUrl(API_ENDPOINTS.REFRESH), {
          refreshToken: this.refreshToken
        });

        const { data } = response.data;
        
        if (!data || !data.accessToken) {
          throw new Error('Invalid refresh response');
        }

        this.accessToken = data.accessToken;
        localStorage.setItem('accessToken', data.accessToken);
        
        console.log('Token refreshed successfully');
        return data.accessToken;
      } catch (error) {
        console.error('Token refresh failed:', error.message);
        // Nếu refresh fail, logout user
        await this.logout();
        throw error;
      }
    },

    async fetchProfile() {
      try {
        if (!this.accessToken) {
          throw new Error('No access token available');
        }

        const response = await axios.get(getApiUrl(API_ENDPOINTS.PROFILE), {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });

        const { data } = response.data;
        
        if (data) {
          this.user = data;
          localStorage.setItem('user', JSON.stringify(data));
        }

        return data;
      } catch (error) {
        console.error('Fetch profile failed:', error.message);
        throw error;
      }
    },

    // Ghi chú: Kiểm tra và khởi tạo trạng thái đăng nhập
    initializeAuth() {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');
      
      if (accessToken && refreshToken && userStr) {
        try {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
          this.user = JSON.parse(userStr);
          this.isLoggedIn = true;
          console.log('Auth state initialized from localStorage:', { username: this.user?.username });
        } catch (error) {
          console.error('Failed to parse user data:', error);
          this.logout();
        }
      } else {
        this.isLoggedIn = false;
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        console.log('No valid auth data in localStorage');
      }
    },

    // Ghi chú: Gửi OTP đến email
    async sendOtp(email) {
      try {
        console.log('authStore.sendOtp called with:', { email });
        
        const response = await axios.post(getApiUrl(API_ENDPOINTS.FORGOT_PASSWORD), {
          email
        });

        const { message } = response.data;
        console.log('OTP sent successfully:', message);
        return { success: true, message };
      } catch (error) {
        console.error('Send OTP failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage = error.response?.data?.message || 'Gửi OTP thất bại. Vui lòng thử lại.';
        throw new Error(errorMessage);
      }
    },

    // Ghi chú: Xác minh OTP (tùy chọn)
    async verifyOtp(email, otp) {
      try {
        console.log('authStore.verifyOtp called with:', { email, otp });
        
        const response = await axios.post(getApiUrl(API_ENDPOINTS.VERIFY_OTP), {
          email,
          otp
        });

        const { success, message } = response.data;
        console.log('OTP verification result:', { success, message });
        return { success, message };
      } catch (error) {
        console.error('Verify OTP failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage = error.response?.data?.message || 'Xác minh OTP thất bại. Vui lòng thử lại.';
        throw new Error(errorMessage);
      }
    },

    // Ghi chú: Đặt lại mật khẩu
    async resetPassword(email, otp, newPassword) {
      try {
        console.log('authStore.resetPassword called with:', { email });
        
        const response = await axios.post(getApiUrl(API_ENDPOINTS.RESET_PASSWORD), {
          email,
          otp,
          newPassword
        });

        const { message } = response.data;
        console.log('Password reset successful:', message);
        return { success: true, message };
      } catch (error) {
        console.error('Reset password failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage = error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
        throw new Error(errorMessage);
      }
    },

    // Ghi chú: Đăng nhập bằng Google
    async loginWithGoogle(googleIdToken) {
      try {
        console.log('authStore.loginWithGoogle called');
        
        const response = await axios.post(getApiUrl(API_ENDPOINTS.GOOGLE_LOGIN), {
          token: googleIdToken
        });

        const { data } = response.data;
        
        if (!data || !data.accessToken || !data.user) {
          throw new Error('Invalid response from server');
        }

        // Lưu tokens và user info
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.user = data.user;
        this.isLoggedIn = true;
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Google login successful:', { email: data.user.email });
        return data;
      } catch (error) {
        console.error('Google login failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const errorMessage = error.response?.data?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
        throw new Error(errorMessage);
      }
    }
  },

  getters: {
    userName: (state) => state.user?.username || null,
    userEmail: (state) => state.user?.email || null,
    userId: (state) => state.user?.id || null,
    userRole: (state) => state.user?.role || null,
  },
});