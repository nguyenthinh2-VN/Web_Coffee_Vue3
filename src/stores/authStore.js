import { defineStore } from 'pinia';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '@/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    returnUrl: null,
    userEmail: null,
    userName: null,
  }),
  actions: {
    async login(email, password) {
      try {
        console.log('authStore.login called with:', { email, password });
        // Fetch all users from db.json
        const response = await axios.get(getApiUrl(API_ENDPOINTS.USERS));
        const users = response.data;

        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Email hoặc mật khẩu không đúng.');
        }

        this.isLoggedIn = true;
        this.userEmail = user.email;
        this.userName = user.name;
        localStorage.setItem('authToken', 'mock-token'); // Mock token for compatibility
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        console.log('Login successful:', { userEmail: user.email, userName: user.name });
        return { email: user.email, name: user.name };
      } catch (error) {
        console.error('Login failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack,
        });
        const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
        throw new Error(errorMessage);
      }
    },
    async register({ name, email, password }) {
      try {
        console.log('authStore.register called with:', { name, email, password });
        // Check if email already exists
        const usersResponse = await axios.get(getApiUrl(API_ENDPOINTS.USERS));
        const users = usersResponse.data;
        if (users.some(u => u.email === email)) {
          throw new Error('Email đã được sử dụng.');
        }

        // Register new user
        const response = await axios.post(getApiUrl(API_ENDPOINTS.USERS), {
          name,
          email,
          password,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });

        const { email: userEmail, name: userName } = response.data;
        if (!userEmail || !userName) {
          throw new Error('Invalid response from server: Missing email or name');
        }

        this.isLoggedIn = true;
        this.userEmail = userEmail;
        this.userName = userName;
        localStorage.setItem('authToken', 'mock-token'); // Mock token for compatibility
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userName', userName);
        console.log('Register successful:', { userEmail, userName });
        return response.data;
      } catch (error) {
        console.error('Register failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack,
        });
        const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        throw new Error(errorMessage);
      }
    },
    logout() {
      console.log('authStore.logout called');
      this.isLoggedIn = false;
      this.userEmail = null;
      this.userName = null;
      this.returnUrl = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    },
  },
});