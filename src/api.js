export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SIZES: '/options/sizes',
  TOPPINGS: '/options/toppings', // Ghi chú: Đã thêm endpoint cho topping
  ICE_OPTIONS: '/options/ice', // Ghi chú: Đã thêm endpoint cho tùy chọn đá
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  FORGOT_PASSWORD: '/auth/forgot-password', // Ghi chú: Endpoint gửi OTP
  VERIFY_OTP: '/auth/verify-otp', // Ghi chú: Endpoint xác minh OTP
  RESET_PASSWORD: '/auth/reset-password', // Ghi chú: Endpoint đặt lại mật khẩu
  USERS: '/users',
  ORDERS: '/orders', // Ghi chú: Endpoint cho đơn hàng
  RATINGS: '/ratings' // Ghi chú: Endpoint cho đánh giá
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};