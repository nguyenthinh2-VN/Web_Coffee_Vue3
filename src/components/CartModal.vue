<template>
  <div v-if="cartStore.isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="cart-container">
      <!-- Thông báo khi giỏ hàng trống -->
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        Giỏ hàng của bạn đang trống.
      </div>
      
      <!-- Bố cục cho giỏ hàng có sản phẩm -->
      <template v-else>
        <!-- PHẦN BODY: Danh sách sản phẩm sẽ cuộn tại đây -->
        <div class="cart-list">
          <div v-for="(item, index) in cartStore.items" :key="index" class="cart-item">
            <img :src="item.image" :alt="item.name" class="item-image" />   
            <div class="item-details">
              <!-- Tên sản phẩm -->
              <div class="item-info">
                <p class="item-name">{{ item.name }}</p>
                
                <!-- Ghi chú: Hiển thị các options đã chọn -->
                <div class="item-options" v-if="hasOptions(item)">
                  <div v-if="item.size" class="option-item">
                    <i class="bi bi-cup"></i>
                    <span>Size: {{ item.size }}</span>
                  </div>
                  <div v-if="item.toppings && item.toppings.length > 0" class="option-item">
                    <i class="bi bi-plus-circle"></i>
                    <span>Topping: {{ item.toppings.join(', ') }}</span>
                  </div>
                  <div v-if="item.ice" class="option-item">
                    <i class="bi bi-snow"></i>
                    <span>Độ đá: {{ item.ice }}</span>
                  </div>
                </div>
                
                <div class="item-meta">
                  <span class="item-price">Đơn giá: {{ formatPrice(item.price) }}</span>
                  <div class="quantity-controls">
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="decreaseQuantity(index)"
                      :disabled="item.quantity <= 1"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <span class="quantity-display">{{ item.quantity }}</span>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="increaseQuantity(index)"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <span class="item-total">Tổng: {{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
              <!-- Nút xóa -->
              <button class="btn-delete" @click="cartStore.removeFromCart(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- PHẦN FOOTER: Cố định, chứa tổng tiền và nút thanh toán -->
        <div class="cart-footer">
          <p class="total-price">Tổng tiền: {{ formatPrice(cartStore.totalPrice) }}</p>
          <button class="btn-checkout" :disabled="cartStore.items.length === 0" @click="checkout">
            Thanh toán
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const cartStore = useCartStore()
const router = useRouter()
const authStore = useAuthStore()

const closeModal = () => { cartStore.isOpen = false }

const checkout = () => {
  // Ghi chú: Kiểm tra giỏ hàng trống
  if (cartStore.items.length === 0) {
    alert('Giỏ hàng trống!')
    return
  }
  
  // Ghi chú: Kiểm tra đăng nhập trước khi thanh toán
  if (!authStore.isLoggedIn) {
    // Ghi chú: Lưu đường dẫn trở về sau khi đăng nhập
    authStore.returnUrl = '/order-preview'
    closeModal()
    alert('Vui lòng đăng nhập để tiếp tục thanh toán!')
    router.push('/login')
    return
  }
  
  // Ghi chú: Đóng modal và chuyển đến trang xem trước đơn hàng
  closeModal()
  router.push('/order-preview')
}

const formatPrice = (price) => {
  if (typeof price !== 'number') return ''
  return new Intl.NumberFormat('de-DE').format(price) + 'đ'
}

// Ghi chú: Các hàm hỗ trợ quản lý giỏ hàng
const hasOptions = (item) => {
  return item.size || (item.toppings && item.toppings.length > 0) || item.ice
}

const increaseQuantity = (index) => {
  if (cartStore.items[index].quantity < 99) {
    cartStore.items[index].quantity++
  }
}

const decreaseQuantity = (index) => {
  if (cartStore.items[index].quantity > 1) {
    cartStore.items[index].quantity--
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

/* Container chính sử dụng Flexbox và có chiều cao tối đa */
.cart-container {
  background: #fdfdf8; /* Màu nền kem nhạt */
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  max-height: 90vh; /* Giới hạn chiều cao modal */
  display: flex;
  flex-direction: column;
}

/* Thông báo giỏ hàng trống */
.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 4rem 0;
}

/* Khu vực danh sách sản phẩm có thể cuộn */
.cart-list {
  overflow-y: auto;  /* Quan trọng: Cho phép cuộn */
  flex-grow: 1;      /* Quan trọng: Chiếm hết không gian còn lại */
  padding: 0.5rem 0;
}

/* Từng sản phẩm trong giỏ */
.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}
.cart-item:first-child {
  padding-top: 0.5rem;
}
.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
}

/* Ghi chú: Styles cho hiển thị options sản phẩm */
.item-options {
  margin-bottom: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
}

.option-item i {
  color: #ff6b00;
  font-size: 0.8rem;
}

.option-item:last-child {
  margin-bottom: 0;
}

.item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: #555;
  flex-wrap: wrap;
}

.item-price {
  font-size: 0.9rem;
  color: #666;
}

.item-total {
  font-weight: 600;
  color: #ff6b00;
  font-size: 1rem;
}

/* Ghi chú: Styles cho điều khiển số lượng */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-controls button:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  padding: 0 8px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  background: #f8f9fa;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-input {
  width: 50px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.btn-delete {
  background-color: #fff;
  border: 1px solid #dc3545;
  color: #dc3545;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
}

/* Khu vực Footer cố định */
.cart-footer {
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0; /* Quan trọng: Không cho co lại, luôn hiển thị */
}

.total-price {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.btn-checkout {
  background-color: #6f4e37; /* Màu nâu */
  color: white;
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-checkout:hover:not(:disabled) {
  background-color: #5a3f2d;
}
.btn-checkout:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>