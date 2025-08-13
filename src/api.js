export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SIZES: '/sizes',
  TOPPINGS: '/toppings', // Ghi chú: Đã thêm endpoint cho topping
  ICE_OPTIONS: '/ice_options', // Ghi chú: Đã thêm endpoint cho tùy chọn đá
  LOGIN: '/login',
  REGISTER: '/register',
  USERS: '/users',
  ORDERS: '/orders', // Ghi chú: Endpoint cho đơn hàng
  RATINGS: '/ratings' // Ghi chú: Endpoint cho đánh giá
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};