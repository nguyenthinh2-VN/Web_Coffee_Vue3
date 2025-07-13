<template>
  <div class="carousel">
    <!-- Swiper component remains unchanged -->
    <swiper
      :spaceBetween="30"
      :centeredSlides="true"
      :loop="true"
      :autoplay="{ delay: 2500, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :navigation="true"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide><img src="../assets/img/slide1.jpg" alt="Slide 1" /></swiper-slide>
      <swiper-slide><img src="../assets/img/slide2.jpg" alt="Slide 2" /></swiper-slide>
      <swiper-slide><img src="../assets/img/slide3.jpg" alt="Slide 3" /></swiper-slide>
    </swiper>
  </div>

  <!-- Product Section with White Background -->
  <div class="product-section">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">Đang tải sản phẩm...</div>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button @click="fetchProducts" class="retry-button">Thử lại</button>
    </div>
    
    <div v-else class="product-grid">
      <!-- Banner takes full width on top -->
      <div class="grid-banner">
        <product-banner />
      </div>
      
      <!-- Product cards from API -->
      <div v-for="product in products" :key="product.id" class="grid-card">
        <product-home :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Imports remain the same
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./../assets/css/Carousel.css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Component imports
import ProductHome from "./ProductHome.vue";
import ProductBanner from "./ProductBanner.vue";

// API constants
import { getApiUrl, API_ENDPOINTS } from "./../api.js";

export default {
  components: {
    Swiper,
    SwiperSlide,
    ProductHome,
    ProductBanner,
  },
  setup() {
    // Reactive data
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        const response = await axios.get(getApiUrl(API_ENDPOINTS.PRODUCTS));
        
        // Chỉ lấy 4 phần tử đầu tiên
        products.value = response.data.slice(0, 4);
        
        console.log('Fetched products:', products.value);
      } catch (err) {
        error.value = 'Không thể tải sản phẩm. Vui lòng thử lại.';
        console.error('Error fetching products:', err);
      } finally {
        loading.value = false;
      }
    };

    // Fetch products when component mounts
    onMounted(() => {
      fetchProducts();
    });

    return {
      modules: [Autoplay, Pagination, Navigation],
      products,
      loading,
      error,
      fetchProducts
    };
  },
};
</script>

<style scoped>
.product-section {
  background-color: #ffffff;
  padding: 24px;
  margin: 24px 0;
}

/* Desktop Layout - giống The Coffee House */
.product-grid {
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  gap: 20px;
  grid-template-columns: 2fr 1fr 1fr; /* Banner chiếm 2 phần, mỗi card 1 phần */
  grid-template-rows: auto auto;
  grid-template-areas:
    'banner card1 card2'
    'banner card3 card4';
}

.grid-banner { 
  grid-area: banner; 
  height: 100%;
}

.grid-card {
  display: flex;
  align-items: stretch;
}

.grid-card:nth-child(2) { grid-area: card1; }
.grid-card:nth-child(3) { grid-area: card2; }
.grid-card:nth-child(4) { grid-area: card3; }
.grid-card:nth-child(5) { grid-area: card4; }

/* Tablet Layout */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'banner banner'
      'card1 card2'
      'card3 card4';
    gap: 16px;
  }
  
  .grid-banner {
    height: 200px;
  }
}

/* Mobile Layout */
@media (max-width: 768px) {
  .product-section {
    padding: 16px;
    margin: 16px 0;
  }

  .product-grid {
    display: grid !important; /* Force grid */
    grid-template-columns: 1fr 1fr !important; /* Force 2 columns */
    grid-template-areas:
      'banner banner'
      'card1 card2'
      'card3 card4' !important;
    gap: 12px;
    width: 100%;
  }
  
  .grid-banner {
    height: 150px;
    grid-area: banner !important;
  }
  
  .grid-card:nth-child(2) { grid-area: card1 !important; }
  .grid-card:nth-child(3) { grid-area: card2 !important; }
  .grid-card:nth-child(4) { grid-area: card3 !important; }
  .grid-card:nth-child(5) { grid-area: card4 !important; }
  
  /* Đảm bảo các card không tự động xuống dòng */
  .grid-card {
    min-width: 0; /* Cho phép card co lại */
    width: 100%;
  }
}
</style>