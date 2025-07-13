<template>
  <div class="menu-product-section">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">Đang tải sản phẩm...</div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button @click="fetchProducts" class="retry-button">Thử lại</button>
    </div>

    <div v-else class="product-list-grid container">
      <div class="row g-3"> <!-- Changed g-4 to g-3 to reduce spacing -->
        <div
          v-for="product in products"
          :key="product.id"
          class="col-6 col-md-3 d-flex align-items-stretch Product-Card"
        >
          <ProductHome :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductHome from './ProductHome.vue';
import { getApiUrl, API_ENDPOINTS } from './../api.js'; // Correct path to api.js

export default {
  components: {
    ProductHome,
  },
  setup() {
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);

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

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      loading,
      error,
      fetchProducts,
    };
  },
};
</script>

<style scoped>
.menu-product-section {
  padding: 24px;
  max-width: 1200px; /* Keep max-width for content centering */
  margin: 0 auto;
  padding-top: 80px; /* Add padding to account for the fixed header */
  padding-bottom: 24px; /* Add some padding at the bottom for better spacing */
}

.loading-container,
.error-container {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #555;
}

.loading-spinner {
  /* Add some basic spinner styling if desired */
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

/* Ensure ProductHome cards stretch to fill height in a row */
.product-list-grid .row {
  display: flex;
  flex-wrap: wrap;
}

.product-list-grid .col-6,
.product-list-grid .col-md-4 {
  display: flex; /* Make column a flex container */
}
.product-image-container{
    height: 300px;
}

</style>