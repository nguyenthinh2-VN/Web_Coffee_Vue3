<template>
  <div class="menu-product-container">
    <MenuBar @category-selected="handleCategorySelect" class="menu-section" />
    
    <div class="product-section">
      <!-- Ghi chú: Thêm logic tìm kiếm và sắp xếp tại đây - Các component UI đã được thêm để triển khai sau -->
      <!-- Search and Sort UI Section -->
      <div class="search-sort-container">
        
        <!-- Sort button - Left side -->
        <SortBar />
        
        <!-- Search box - Right side -->
        <SearchBar />
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">Đang tải sản phẩm...</div>
      </div>

      <div v-else-if="error" class="error-container">
        <div class="error-message">{{ error }}</div>
        <button @click="fetchProducts" class="retry-button">Thử lại</button>
      </div>

      <div v-else class="product-list-grid container">
        <div class="row g-3">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="col-6 col-md-3 d-flex align-items-stretch Product-Card"
            :data-category="product.category_id"
          >
            <ProductHome :product="product" />
          </div>
        </div>
        <!-- Pagination component -->
        <Pagination />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue';
import ProductHome from './ProductHome.vue';
import MenuBar from './MenuBar.vue';
import SearchBar from './SearchBar.vue';
import SortBar from './SortBar.vue';
import Pagination from './Pagination.vue';
import { useMenuStore } from '../stores/menuStore.js';

export default {
  components: {
    ProductHome,
    MenuBar,
    SearchBar,
    SortBar,
    Pagination
  },
  setup() {
    // Use the menu store
    const menuStore = useMenuStore();

    const handleCategorySelect = (categoryId) => {
      menuStore.setSelectedCategory(categoryId);
    };

    // Initialize the store when component mounts
    onMounted(async () => {
      try {
        await menuStore.initializeStore();
      } catch (error) {
        console.error('Error initializing menu store:', error);
      }
    });

    return {
      // Store state and computed properties (wrapped in computed for reactivity)
      loading: computed(() => menuStore.loading),
      error: computed(() => menuStore.error),
      paginatedProducts: computed(() => menuStore.paginatedProducts),
      filteredProducts: computed(() => menuStore.filteredProducts),
      
      // Store actions
      handleCategorySelect,
      
      // For retry functionality
      fetchProducts: menuStore.initializeStore
    };
  },
};
</script>

<style scoped>
.menu-product-container {
  display: flex;
  min-height: 100vh;
  padding-top: 80px; /* For fixed header */
}

.menu-section {
  flex: 0 0 250px; /* Fixed width for menu */
}

.product-section {
  flex: 1;
  padding: 24px;
  padding-left: 274px; /* 250px + 24px padding */
  margin-top: 50px;
}


/* Ghi chú: Thêm chức năng tìm kiếm và sắp xếp sau */
/* Styles cho UI Tìm kiếm và Sắp xếp - Ghi chú: Thêm chức năng tương tác sau */
.search-sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 10px 0;
  margin-left: 170px; /* Align with product grid margin */
}


.search-box {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 170px; /* Align with product grid margin */
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

.sort-container {
  display: flex;
  align-items: center;
}

.sort-btn {
  height: 38px;
  width: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.sort-btn:hover {
  background-color: #007bff;
  border-color: #007bff;
}

/* Mobile styles */
@media (max-width: 768px) {
  .menu-product-container {
    flex-direction: column;
    padding-top: 60px;
  }

  .menu-section {
    flex: none;
    width: 100%;
    position: sticky;
    top: 60px;
    z-index: 100;
    background: white;
  }

  .product-section {
    padding: 20px;
    padding-left: 20px;
    margin-top: 30px;
  }

  /* Mobile responsive styles for search and sort */
  .search-sort-container {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    margin-left: 0 !important; /* Remove desktop margins on mobile */
  }

  .search-box {
    justify-content: center;
    margin-right: 0 !important; /* Remove desktop margins on mobile */
  }

  .search-input {
    width: 100%;
    max-width: 300px;
  }

  .sort-container {
    justify-content: center;
  }

  .product-list-grid .row {
    margin: 0 -10px;
  }

  .Product-Card {
    padding: 0 10px;
  }
}

.loading-container,
.error-container {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #555;
}

.error-message {
  color: #d9534f;
  margin-bottom: 10px;
}

.retry-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #0056b3;
}

.product-list-grid .row {
  display: flex;
  flex-wrap: wrap;
}

.product-list-grid .col-6,
.product-list-grid .col-md-4 {
  display: flex;
}

.product-image-container {
  height: 300px;
}
</style>