<template>
  <div class="product-detail-container" v-if="product">
    <div class="product-detail-content">
      <!-- Left side - Product Image -->
      <div class="product-image-section">
        <div class="product-image">
          <img :src="product.hinh" :alt="product.tensp" />
        </div>
        
        <!-- Ghi chú: Component đánh giá sao riêng biệt dưới hình ảnh -->
        <ProductRating :productId="product.id" />
      </div>

      <!-- Right side - Product Info -->
      <div class="product-info">
        <h1 class="product-title">{{ product.tensp }}</h1>
        <div class="product-price">{{ formatPrice(totalPrice) }}</div>

        <!-- Ghi chú: UI động dựa trên loại sản phẩm - Logic phân biệt Cà phê và Trà -->
        
        <!-- Size Selection for Tea Products -->
        <div v-if="isTeaProduct" class="size-selection">
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

        <!-- Fixed Size for Coffee Products -->
        <div v-else class="coffee-size-info">
          <h3>Size: Vừa (Size duy nhất)</h3>
          <p class="size-note">Sản phẩm cà phê chỉ có một size cố định</p>
        </div>

        <!-- Topping Selection (Only for Tea Products) -->
        <div v-if="isTeaProduct" class="topping-selection">
          <h3>Chọn topping (tùy chọn)</h3>
          <div class="topping-options">
            <label
              v-for="topping in toppings"
              :key="topping.id"
              class="topping-option"
            >
              <input
                type="checkbox"
                :value="topping.id"
                v-model="selectedToppings"
                class="topping-checkbox"
              />
              <div class="topping-info">
                <span class="topping-name">{{ topping.tentopping }}</span>
                <span class="topping-price">+{{ formatPrice(topping.gia) }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Ice Options Selection -->
        <div class="ice-selection">
          <h3>Chọn độ đá (bắt buộc)</h3>
          <div class="ice-options">
            <label
              v-for="ice in iceOptions"
              :key="ice.id"
              class="ice-option"
            >
              <input
                type="radio"
                :value="ice.id"
                v-model="selectedIce"
                name="ice-option"
                class="ice-radio"
              />
              <span class="ice-name">{{ ice.ten_ice }}</span>
            </label>
          </div>
        </div>

        <!-- Quantity Selection -->
        <div class="quantity-selection">
          <h3>Số lượng</h3>
          <div class="quantity-controls">
            <button 
              type="button" 
              class="btn btn-outline-secondary quantity-btn" 
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
            >
              <i class="bi bi-dash"></i>
            </button>
            <input 
              type="number" 
              class="form-control quantity-input" 
              v-model.number="quantity"
              min="1"
              max="99"
            />
            <button 
              type="button" 
              class="btn btn-outline-secondary quantity-btn" 
              @click="increaseQuantity"
              :disabled="quantity >= 99"
            >
              <i class="bi bi-plus"></i>
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
import ProductRating from './ProductRating.vue';
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
    ProductRating,
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
    const selectedToppings = ref([]); // Ghi chú: Logic chọn topping
    const selectedIce = ref(null); // Ghi chú: Logic chọn độ đá
    const quantity = ref(1); // Ghi chú: Điều khiển số lượng
    // Ghi chú: Xác định sản phẩm là trà hay cà phê dựa trên category_id
    // category_id = 1: Cà phê (chỉ có ice)
    // category_id = 2: Trà sữa (có ice và topping)
    const isTeaProduct = computed(() => {
      const categoryId = productStore.currentProduct?.category_id;
      return categoryId === 2;
    });
    
    // Tính tổng giá tiền (giá gốc + giá size + toppings)
    const totalPrice = computed(() => {
      const basePrice = productStore.currentProduct?.gia || 0;
      const sizePrice = isTeaProduct.value ? (selectedSize.value?.gia || 0) : 0;
      
      // Tính giá topping
      const toppingPrice = selectedToppings.value.reduce((total, toppingId) => {
        const topping = productStore.toppings.find(t => t.id === toppingId);
        return total + (topping?.gia || 0);
      }, 0);
      
      return basePrice + sizePrice + toppingPrice;
    });

    // Chọn size
    const selectSize = (size) => {
      selectedSize.value = size;
    };

    // Ghi chú: Các hàm điều khiển số lượng
    const increaseQuantity = () => {
      if (quantity.value < 99) {
        quantity.value++;
      }
    };

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    // Ghi chú: Tải topping và tùy chọn đá từ productStore
    const loadToppingsAndIce = async () => {
      try {
        // Chỉ load ice options cho cả cà phê (category_id = 1) và trà sữa (category_id = 2)
        await productStore.fetchIceOptions();
        
        // Chỉ load toppings cho trà sữa (category_id = 2)
        if (isTeaProduct.value) {
          await productStore.fetchToppings();
        }
        
        // Set default ice option
        if (productStore.iceOptions.length > 0) {
          selectedIce.value = productStore.iceOptions[0].id;
        }
      } catch (error) {
        console.error('Error loading toppings and ice options:', error);
      }
    };

    // Hàm thêm vào giỏ hàng
    const addToCart = () => {
      // Validation based on product type
      if (isTeaProduct.value && !selectedSize.value) {
        alert('Vui lòng chọn size trước khi thêm vào giỏ hàng!');
        return;
      }
      
      if (!selectedIce.value) {
        alert('Vui lòng chọn độ đá trước khi thêm vào giỏ hàng!');
        return;
      }

      // Get selected toppings info using productStore.toppings
      const selectedToppingsInfo = selectedToppings.value.map(toppingId => {
        const topping = productStore.toppings.find(t => t.id === toppingId);
        return topping ? topping.tentopping : '';
      }).filter(Boolean);
      
      // Get ice info using productStore.iceOptions
      const iceInfo = productStore.iceOptions.find(ice => ice.id === selectedIce.value);
      
      // Get size info
      const sizeInfo = isTeaProduct.value ? selectedSize.value : null;

      cartStore.addToCart({
        id: productStore.currentProduct.id,
        name: productStore.currentProduct.tensp,
        image: productStore.currentProduct.hinh,
        size: isTeaProduct.value ? selectedSize.value?.tensize : 'Vừa',
        sizeId: sizeInfo?.id || 1,
        toppings: selectedToppingsInfo,
        toppingIds: selectedToppings.value,
        iceOptionId: selectedIce.value,
        ice: iceInfo?.ten_ice,
        price: totalPrice.value,
        quantity: quantity.value // Ghi chú: Sử dụng số lượng đã chọn
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
        await loadToppingsAndIce(); // Load toppings and ice options
        
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
      toppings: computed(() => productStore.toppings), // Ghi chú: Sử dụng toppings từ productStore
      iceOptions: computed(() => productStore.iceOptions), // Ghi chú: Sử dụng tùy chọn đá từ productStore
      loading: computed(() => productStore.currentProductLoading),
      error: computed(() => productStore.error),
      // Store actions
      formatPrice: productStore.formatPrice,
      // Local state and methods
      selectedSize,
      selectedToppings, // Ghi chú: Logic chọn topping
      selectedIce, // Ghi chú: Logic chọn độ đá
      quantity, // Ghi chú: Điều khiển số lượng
      isTeaProduct, // Ghi chú: Logic UI động
      totalPrice,
      selectSize,
      increaseQuantity, // Ghi chú: Hàm điều khiển số lượng
      decreaseQuantity,
      addToCart
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

.product-image-section {
  flex: 0 0 570px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-image {
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

/* Coffee Size Info Styles */
.coffee-size-info {
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ff6b00;
}

.coffee-size-info h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.size-note {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* Topping Selection Styles */
.topping-selection {
  margin-bottom: 32px;
}

.topping-selection h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.topping-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topping-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.topping-option:hover {
  border-color: #ff6b00;
  background-color: #fff3e0;
}

.topping-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #ff6b00;
}

.topping-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.topping-name {
  font-weight: 500;
  color: #333;
}

.topping-price {
  font-size: 14px;
  color: #ff6b00;
  font-weight: 600;
}

/* Ice Selection Styles */
.ice-selection {
  margin-bottom: 32px;
}

.ice-selection h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.ice-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: black
}

.ice-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  min-width: 120px;
}

.ice-option:hover {
  border-color: #ff6b00;
  background-color: #fff3e0;
}

.ice-option:has(.ice-radio:checked) {
  border-color: #ff6b00;
  background-color: #fff3e0;
}

.ice-radio {
  width: 16px;
  height: 16px;
  accent-color: #ff6b00;
}

.ice-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

/* Quantity Selection Styles */
.quantity-selection {
  margin-bottom: 32px;
}

.quantity-selection h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 150px;
}

.quantity-btn {
  width: 40px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:first-child {
  border-radius: 6px 0 0 6px;
  border-right: none;
}

.quantity-btn:last-child {
  border-radius: 0 6px 6px 0;
  border-left: none;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 70px;
  height: 38px;
  text-align: center;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
  border-radius: 0;
  font-weight: 600;
}

.quantity-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: none;
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

  .product-image-section {
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

  .topping-options {
    gap: 8px;
  }

  .topping-option {
    padding: 10px 12px;
  }

  .ice-options {
    gap: 8px;
  }

  .ice-option {
    padding: 10px 16px;
    min-width: 100px;
  }

  .coffee-size-info {
    padding: 16px;
    margin-bottom: 24px;
  }

  .size-name {
    font-size: 14px;
  }

  .order-button {
    padding: 16px;
    font-size: 16px;
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
