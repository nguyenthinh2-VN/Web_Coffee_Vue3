// constants/api.js
export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  // Có thể thêm các endpoints khác
  CATEGORIES: '/categories'
};

// Helper function để tạo full URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};