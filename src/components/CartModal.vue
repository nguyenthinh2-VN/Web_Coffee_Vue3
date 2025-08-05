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
              <!-- Tên sản phẩm, Đơn giá, Số lượng -->
              <div class="item-info">
                <p class="item-name">{{ item.name }}</p>
                <div class="item-meta">
                  <span>Đơn giá: {{ formatPrice(item.price) }}</span>
                  <label class="item-quantity">
                    Số lượng:
                    <input type="number" v-model.number="item.quantity" min="1" class="quantity-input" />
                  </label>
                  <span>Tổng: {{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
              <!-- Nút xóa -->
              <button class="btn-delete" @click="cartStore.removeFromCart(index)">Xóa</button>
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

const cartStore = useCartStore()

const closeModal = () => { cartStore.isOpen = false }

const checkout = () => {
  alert('Cảm ơn bạn đã đặt hàng!')
  cartStore.clearCart()
  closeModal()
}

const formatPrice = (price) => {
  if (typeof price !== 'number') return ''
  return new Intl.NumberFormat('de-DE').format(price) + 'đ'
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
  margin: 0;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #555;
  flex-wrap: wrap; /* Cho phép xuống dòng nếu không đủ chỗ */
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
  background-color: white;
  border: 1px solid #ccc;
  color: #555;
  padding: 0.3rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.2s;
}
.btn-delete:hover {
  background-color: #f5f5f5;
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