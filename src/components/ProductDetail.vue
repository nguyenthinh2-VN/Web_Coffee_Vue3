<template>
  <div class="product-detail-container" v-if="product">
    <div class="product-detail-content">
      <!-- Left side - Product Image -->
      <div class="product-image">
        <img :src="product.hinh" :alt="product.tensp" />
      </div>

      <!-- Right side - Product Info -->
      <div class="product-info">
        <h1 class="product-title">{{ product.tensp }}</h1>
        <div class="product-price">{{ formatPrice(totalPrice) }}</div>

        <!-- Size Selection -->
        <div class="size-selection">
          <h3>Chọn size (bắt buộc)</h3>
          <div class="size-options">
            <button
              v-for="size in sizes"
              :key="size.id"
              class="size-button"
              :class="{ active: selectedSize?.id === size.id }"
              @click="selectSize(size)"
            >
              <div class="size-icon">
                <n-icon size="20">
                  <coffee-outline v-if="size.id === 1" />
                  <cafe-outline v-else-if="size.id === 2" />
                  <beer-outline v-else />
                </n-icon>
              </div>
              <div class="size-info">
                <span class="size-name">{{ size.tensize }}</span>
                <span class="size-price" v-if="size.gia > 0">+{{ formatPrice(size.gia) }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Order Button -->
        <button class="order-button" @click="addToCart">
          <n-icon size="20">
            <cart-outline />
          </n-icon>
          Đặt giao tận nơi
        </button>

        <!-- Product Description -->
        <div class="product-description">
          <h3>Mô tả sản phẩm</h3>
          <p>{{ product.mota }}</p>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="related-products">
      <h2>Sản phẩm liên quan</h2>
      <SlideItem :products="relatedProducts" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import SlideItem from './SlideItem.vue';
import { NIcon } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/productStore.js';
import { useCartStore } from '../stores/cart.js';
import {
  CafeOutline,
  BeerOutline,
  CoffeeOutline,
  CartOutline
} from '@vicons/ionicons5';

export default {
  components: {
    SlideItem,
    NIcon,
    CafeOutline,
    BeerOutline,
    CoffeeOutline,
    CartOutline
  },
  setup() {
    const route = useRoute();
    const productStore = useProductStore();
    const cartStore = useCartStore();
    const selectedSize = ref(null);
    // Tính tổng giá tiền (giá gốc + giá size)
    const totalPrice = computed(() => {
      const basePrice = productStore.currentProduct?.gia || 0;
      const sizePrice = selectedSize.value?.gia || 0;
      return basePrice + sizePrice;
    });

    // Chọn size
    const selectSize = (size) => {
      selectedSize.value = size;
    };

    // Hàm thêm vào giỏ hàng
    const addToCart = () => {
      if (!productStore.currentProduct || !selectedSize.value) {
        alert('Vui lòng chọn size trước khi thêm vào giỏ hàng!');
        return;
      }

      cartStore.addToCart({
        id: productStore.currentProduct.id,
        name: productStore.currentProduct.ten,
        image: productStore.currentProduct.hinh,
        size: selectedSize.value.ten,
        price: totalPrice.value,
        quantity: 1
      });
      alert('✅ Đã thêm sản phẩm vào giỏ hàng!');
    };


    // Fetch data
    const fetchData = async () => {
      try {
        const productId = route.params.id;
        console.log('Fetching product with ID:', productId);
        
        if (!productId) {
          console.error('No product ID provided');
          return;
        }

        // Use store actions to fetch data
        await productStore.fetchProductById(productId);
        await productStore.fetchSizes();
        
        if (productStore.currentProduct) {
          await productStore.fetchRelatedProducts(productStore.currentProduct.category_id);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    // Watch for route changes
    watch(
      () => route.params.id,
      (newId, oldId) => {
        if (newId && newId !== oldId) {
          console.log('Route ID changed from', oldId, 'to', newId);
          selectedSize.value = null; // Reset selected size
          fetchData();
        }
      },
      { immediate: true } // Gọi ngay lần đầu khi component mount
    );

    onMounted(() => {
      console.log('Component mounted with route params:', route.params);
    });

    return {
      // Store state - using computed for reactivity
      product: computed(() => productStore.currentProduct),
      sizes: computed(() => productStore.sizes),
      relatedProducts: computed(() => productStore.relatedProducts),
      loading: computed(() => productStore.currentProductLoading),
      error: computed(() => productStore.error),
      // Store actions
      formatPrice: productStore.formatPrice,
      // Local state and methods
      selectedSize,
      totalPrice,
      selectSize,
      addToCart // Đã expose hàm ra template
    };
  }
};
</script>

<style scoped>
.product-detail-container {
  padding: 100px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-detail-content {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.product-image {
  flex: 0 0 570px;
  height: 570px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  padding-top: 20px;
}

.product-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.product-price {
  font-size: 28px;
  font-weight: 600;
  color: #ff6b00;
  margin-bottom: 32px;
}

.size-selection {
  margin-bottom: 32px;
}

.size-selection h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.size-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.size-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

.size-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.size-price {
  font-size: 14px;
  color: #666;
  margin-left: 8px;
}

.size-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 150px;
}

.size-button:hover {
  border-color: #ff6b00;
  transform: translateY(-2px);
}

.size-button.active {
  border-color: #ff6b00;
  background-color: #fff3e0;
}

.size-icon {
  color: #ff6b00;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.order-button {
  width: 100%;
  padding: 18px;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

.order-button:hover {
  background-color: #ff8533;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 0, 0.3);
}

.product-description {
  border-top: 1px solid #eee;
  padding-top: 32px;
}

.product-description h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.product-description p {
  color: #666;
  line-height: 1.8;
  font-size: 16px;
}

.related-products {
  border-top: 1px solid #eee;
  padding-top: 32px;
  margin-bottom: 40px;
}

.related-products h2 {
  font-size: 22px;
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .product-detail-content {
    flex-direction: column;
    gap: 32px;
  }

  .product-image {
    flex: none;
    width: 100%;
    max-width: 570px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .product-detail-container {
    padding: 80px 16px 32px;
  }

  .product-title {
    font-size: 24px;
  }

  .product-price {
    font-size: 24px;
  }

  .size-button {
    padding: 14px 16px;
    min-width: 120px;
  }

  .size-name {
    font-size: 14px;
  }

  .order-button {
    padding: 16px;
    font-size: 16px;
  }

  .product-description p {
    font-size: 14px;
  }

  .related-products {
    padding-top: 24px;
    margin-bottom: 32px;
  }

  .related-products h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
}
</style>
