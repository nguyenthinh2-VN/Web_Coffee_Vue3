// constants/api.js
export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SIZES: '/sizes'
};

// Helper function để tạo full URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};