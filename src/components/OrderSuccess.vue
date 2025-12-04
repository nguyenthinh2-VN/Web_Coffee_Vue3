<template>
  <div class="order-success-container">
    <!-- Success Header -->
    <div class="success-header">
      <div class="success-icon">
        <i class="bi bi-check-circle"></i>
      </div>
      <h1 class="success-title">Đơn Hàng Đã Được Tạo Thành Công!</h1>
      <p class="success-subtitle">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm.</p>
    </div>

    <!-- Order Info Card -->
    <div class="order-info-card">
      <div class="info-section">
        <h2 class="section-title">Thông Tin Đơn Hàng</h2>
        
        <div class="info-row">
          <span class="label">Mã Đơn Hàng:</span>
          <span class="value order-code">{{ orderData?.orderCode }}</span>
        </div>

        <div class="info-row">
          <span class="label">Trạng Thái:</span>
          <span class="value status" :class="orderData?.status?.toLowerCase()">
            {{ getStatusText(orderData?.status) }}
          </span>
        </div>

        <div class="info-row">
          <span class="label">Phương Thức Thanh Toán:</span>
          <span class="value">{{ getPaymentMethodText(orderData?.paymentMethod) }}</span>
        </div>

        <div class="info-row">
          <span class="label">Phương Thức Giao Hàng:</span>
          <span class="value">{{ getDeliveryMethodText(orderData?.deliveryMethod) }}</span>
        </div>

        <div class="info-row">
          <span class="label">Ngày Tạo:</span>
          <span class="value">{{ formatDate(orderData?.createdAt) }}</span>
        </div>
      </div>

      <!-- Amount Summary -->
      <div class="amount-section">
        <h2 class="section-title">Chi Tiết Thanh Toán</h2>

        <div class="amount-row">
          <span class="label">Tạm Tính:</span>
          <span class="value">{{ formatPrice(orderData?.totalAmount - orderData?.shippingFee + orderData?.discount) }}</span>
        </div>

        <div class="amount-row">
          <span class="label">Phí Vận Chuyển:</span>
          <span class="value">{{ formatPrice(orderData?.shippingFee) }}</span>
        </div>

        <div v-if="orderData?.discount > 0" class="amount-row discount">
          <span class="label">Giảm Giá:</span>
          <span class="value">-{{ formatPrice(orderData?.discount) }}</span>
        </div>

        <div class="amount-row total">
          <span class="label">Tổng Cộng:</span>
          <span class="value">{{ formatPrice(orderData?.totalAmount) }}</span>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="orderData?.notes" class="notes-section">
        <h2 class="section-title">Ghi Chú</h2>
        <p class="notes-text">{{ orderData.notes }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="btn-primary" @click="goHome">
        <i class="bi bi-house"></i>
        Quay Lại Trang Chủ
      </button>
      <button class="btn-secondary" @click="viewOrders">
        <i class="bi bi-list-check"></i>
        Xem Đơn Hàng Của Tôi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()

const orderData = ref(null)
const isLoading = ref(false)

// Format price
const formatPrice = (price) => {
  if (typeof price !== 'number') return ''
  return new Intl.NumberFormat('de-DE').format(price) + 'đ'
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get status text
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': 'Chờ Xác Nhận',
    'CONFIRMED': 'Đã Xác Nhận',
    'PROCESSING': 'Đang Xử Lý',
    'SHIPPED': 'Đã Gửi',
    'DELIVERED': 'Đã Giao',
    'CANCELLED': 'Đã Hủy'
  }
  return statusMap[status] || status
}

// Get payment method text
const getPaymentMethodText = (method) => {
  const methodMap = {
    'COD': 'Thanh Toán Khi Nhận Hàng (COD)',
    'VNPAY': 'Thanh Toán Online (VNPAY)',
    'CREDIT_CARD': 'Thẻ Tín Dụng'
  }
  return methodMap[method] || method
}

// Get delivery method text
const getDeliveryMethodText = (method) => {
  const methodMap = {
    'DELIVERY': 'Giao Hàng Tận Nơi',
    'PICKUP': 'Lấy Tại Cửa Hàng'
  }
  return methodMap[method] || method
}

// Go home
const goHome = () => {
  router.push('/')
}

// View orders
const viewOrders = () => {
  const orderId = route.params.orderId
  if (orderId) {
    router.push({
      name: 'OrderDetail',
      params: { orderId: orderId }
    })
  } else {
    router.push({
      name: 'MyOrders'
    })
  }
}

// Fetch order data from API
const fetchOrderData = async (orderId) => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('accessToken')
    
    const response = await axios.get(
      `http://localhost:3000/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    console.log('Fetched order data:', response.data)

    if (response.data && response.data.data) {
      orderData.value = response.data.data
    } else {
      console.warn('No order data in response')
    }
  } catch (error) {
    console.error('Lỗi fetch order data:', error)
    
    // Fallback: Lấy từ orderStore nếu API fail
    const previewData = orderStore.getPreviewData()
    if (previewData && previewData.id) {
      orderData.value = previewData
      console.log('Using fallback order data from store')
    }
  } finally {
    isLoading.value = false
  }
}

// Load order data on mount
onMounted(() => {
  let orderId = route.params.orderId
  
  // Nếu không có orderId trong params, thử lấy từ query params
  if (!orderId) {
    orderId = route.query.orderId
  }
  
  // Nếu vẫn không có, thử lấy từ localStorage
  if (!orderId) {
    orderId = localStorage.getItem('lastOrderId')
  }
  
  console.log('Order ID:', orderId)

  if (orderId) {
    // Fetch dữ liệu từ API
    fetchOrderData(orderId)
  } else {
    // Fallback: Lấy từ orderStore
    const previewData = orderStore.getPreviewData()
    if (previewData && previewData.id) {
      orderData.value = previewData
      console.log('Using order data from store')
    } else {
      console.warn('No order data found')
    }
  }
  
  // Xóa lastOrderId từ localStorage sau khi sử dụng
  localStorage.removeItem('lastOrderId')
})
</script>

<style scoped>
.order-success-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 40px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Success Header */
.success-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.success-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.success-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* Order Info Card */
.order-info-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section,
.amount-section,
.notes-section {
  margin-bottom: 30px;
}

.info-section:last-child,
.amount-section:last-child,
.notes-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff6b00;
}

.info-row,
.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child,
.amount-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.order-code {
  font-family: 'Courier New', monospace;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.confirmed {
  background: #d1ecf1;
  color: #0c5460;
}

.status.processing {
  background: #cfe2ff;
  color: #084298;
}

.status.shipped {
  background: #d1e7dd;
  color: #0f5132;
}

.status.delivered {
  background: #d1e7dd;
  color: #0f5132;
}

.status.cancelled {
  background: #f8d7da;
  color: #842029;
}

/* Amount Section */
.amount-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.amount-row.discount {
  color: #28a745;
}

.amount-row.total {
  border-top: 2px solid #ff6b00;
  border-bottom: none;
  padding-top: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ff6b00;
}

.amount-row.total .value {
  color: #ff6b00;
}

/* Notes Section */
.notes-text {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.btn-primary {
  background: #ff6b00;
  color: white;
}

.btn-primary:hover {
  background: #e55a00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
  border-color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .order-success-container {
    padding: 20px;
  }

  .success-title {
    font-size: 1.5rem;
  }

  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .order-info-card {
    padding: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .info-row,
  .amount-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
