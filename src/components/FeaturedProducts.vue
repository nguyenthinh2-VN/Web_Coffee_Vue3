<template>
  <div class="featured-section">
    <div class="featured-container">
      <!-- Header -->
      <div class="featured-header">
        <div class="header-top">
          <span class="badge">ngọt ngào</span>
          <h2 class="section-title">FEATURED PRODUCT</h2>
        </div>
        <h1 class="collection-title">"NHÀ" COLLECTION</h1>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="[
            'category-btn',
            { active: selectedCategory === category.id },
          ]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Products Slider -->
      <div class="products-slider">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchProducts" class="retry-btn">Thử lại</button>
        </div>

        <swiper
          v-else
          :slidesPerView="4"
          :spaceBetween="20"
          :navigation="true"
          :modules="modules"
          :breakpoints="{
            320: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }"
          class="products-swiper"
        >
          <swiper-slide v-for="product in products" :key="product.id">
            <div class="product-card">
              <div class="product-image">
                <img :src="product.hinh" :alt="product.tensp" />
              </div>
              <div class="product-info">
                <p class="product-category">Cà Phê</p>
                <h3 class="product-name">{{ product.tensp }}</h3>
                <p class="product-price">{{ formatPrice(product.gia) }}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default {
  name: "FeaturedProducts",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const selectedCategory = ref(1);

    const categories = ref([
      { id: 1, name: "CÀ PHÊ", count: 17 },
      { id: 2, name: "TRÀ", count: 2 },
      { id: 3, name: "LATTE & FRAPPE", count: 12 },
      { id: 4, name: "SIGNATURE FOOD", count: 7 },
      { id: 5, name: "PASTRY & MORE", count: 17 },
    ]);

    const modules = [Navigation];

    const formatPrice = (price) => {
      if (typeof price !== "number") return "";
      return new Intl.NumberFormat("vi-VN").format(price) + " đ";
    };

    const fetchProducts = async () => {
      try {
        loading.value = true;
        error.value = null;

        const response = await axios.get(
          `http://localhost:3000/products/category/${selectedCategory.value}?sortType=newest&page=1&size=10`
        );

        console.log("Featured products response:", response.data);

        if (response.data && response.data.data && response.data.data.data) {
          products.value = response.data.data.data;
          // Mark first product as best seller for demo
          if (products.value.length > 0) {
            products.value[0].isBestSeller = true;
          }
        }
      } catch (err) {
        error.value = "Không thể tải sản phẩm. Vui lòng thử lại.";
        console.error("Error fetching featured products:", err);
      } finally {
        loading.value = false;
      }
    };

    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId;
      fetchProducts();
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      loading,
      error,
      selectedCategory,
      categories,
      modules,
      formatPrice,
      fetchProducts,
      selectCategory,
    };
  },
};
</script>

<style scoped>
.featured-section {
  background-color: #fcf9eb;
  padding: 60px 24px;
  margin: 0;
}

.featured-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.featured-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.badge {
  background: #e57905;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: lowercase;
  transform: rotate(-5deg);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  letter-spacing: 2px;
  margin: 0;
}

.collection-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #e57905;
  margin: 0;
  letter-spacing: 1px;
}

/* Category Filter */
.category-filter {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.category-btn {
  background: transparent;
  border: none;
  color: #333;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: #e57905;
  transition: width 0.3s ease;
}

.category-btn:hover::after,
.category-btn.active::after {
  width: 100%;
}

.category-btn.active {
  color: black;
}

/* Products Slider */
.products-slider {
  position: relative;
}

.products-swiper {
  padding: 20px 40px;
}

:deep(.swiper-slide) {
  background: transparent;
}

.product-card {
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
}

.product-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: transparent;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  margin: 50px 0;
}

.product-card:hover .product-image img {
  transform: scale(1);
}

.product-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.product-category {
  font-size: 0.8rem;
  color: #999;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e57905;
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #e57905;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-state p,
.error-state p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.retry-btn {
  background: #e57905;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #d16d04;
  transform: translateY(-2px);
}

/* Swiper Navigation */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: #e57905;
  background: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.swiper-button-prev:after),
:deep(.swiper-button-next:after) {
  font-size: 18px;
  font-weight: 700;
}

:deep(.swiper-button-prev) {
  left: 0;
}

:deep(.swiper-button-next) {
  right: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .collection-title {
    font-size: 1.8rem;
  }

  .featured-container {
    padding: 40px 20px;
  }

  .category-filter {
    gap: 10px;
  }

  .category-btn {
    font-size: 0.85rem;
    padding: 8px 12px;
  }

  .products-swiper {
    padding: 20px 0;
  }

  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    display: none !important;
  }
}
</style>