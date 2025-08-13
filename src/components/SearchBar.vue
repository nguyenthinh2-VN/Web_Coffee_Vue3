<template>
    <div class="search-box">
      <input
        type="text"
        class="form-control search-input"
        placeholder="Tìm kiếm sản phẩm..."
        v-model="searchKeyword"
      />
      <button
        class="btn btn-outline-secondary search-btn"
        type="button"
        title="Tìm kiếm"
        @click="handleSearch"
      >
        <i class="bi bi-search"></i>
      </button>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import { useMenuStore } from '../stores/menuStore.js';
  
  export default {
    name: 'SearchBar',
    setup() {
      const menuStore = useMenuStore();
      const localSearchKeyword = ref('');
      let searchTimeout = null;
  
      // Watch for changes in the local search keyword and update the store with debouncing
      watch(localSearchKeyword, (newValue) => {
        // Clear previous timeout
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        
        // Set new timeout for debounced search
        searchTimeout = setTimeout(() => {
          console.log('Debounced search triggered with:', newValue);
          menuStore.setSearchKeyword(newValue.trim());
        }, 300); // 300ms delay
      });
  
      // Handle search keyword changes (for button click - immediate)
      const handleSearch = () => {
        // Clear any pending timeout
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        console.log('Immediate search triggered with:', localSearchKeyword.value);
        menuStore.setSearchKeyword(localSearchKeyword.value.trim());
      };
  
      return {
        searchKeyword: localSearchKeyword,
        handleSearch
      };
    }
  };
  </script>
  
  <style scoped>
  .search-box {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-right: 170px;
  }
  
  .search-input {
    width: 250px;
    height: 38px;
    border: 1px solid #ddd;
    border-radius: 6px 0 0 6px;
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  .search-btn {
    height: 38px;
    border-radius: 0 6px 6px 0;
    border-left: none;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .search-btn:hover {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  @media (max-width: 768px) {
    .search-box {
      justify-content: center;
      margin-right: 0;
    }
  
    .search-input {
      width: 100%;
      max-width: 300px;
    }
  }
  </style>