<template>
  <div class="menu-product-container">
    <MenuBar @category-selected="handleCategorySelect" class="menu-section" />
    
    <div class="product-section">
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
            v-for="product in filteredProducts"
            :key="product.id"
            class="col-6 col-md-3 d-flex align-items-stretch Product-Card"
            :data-category="product.category_id"
          >
            <ProductHome :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ProductHome from './ProductHome.vue';
import MenuBar from './MenuBar.vue';
import { getApiUrl, API_ENDPOINTS } from './../api.js';

export default {
  components: {
    ProductHome,
    MenuBar
  },
  setup() {
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const selectedCategory = ref(null);

    const filteredProducts = computed(() => {
      if (!selectedCategory.value) return products.value;
      return products.value.filter(product => product.category_id === selectedCategory.value);
    });

    const fetchProducts = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await axios.get(getApiUrl(API_ENDPOINTS.PRODUCTS));
        products.value = response.data;
        console.log('Fetched products for menu:', products.value);
      } catch (err) {
        error.value = 'Không thể tải sản phẩm. Vui lòng thử lại.';
        console.error('Error fetching products for menu:', err);
      } finally {
        loading.value = false;
      }
    };

    const handleCategorySelect = (categoryId) => {
      selectedCategory.value = categoryId;
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      loading,
      error,
      fetchProducts,
      selectedCategory,
      filteredProducts,
      handleCategorySelect
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