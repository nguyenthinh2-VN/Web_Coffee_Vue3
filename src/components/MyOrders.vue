<template>
  <div class="my-orders-container">
    <div class="orders-header">
      <h1>Đơn Hàng Của Tôi</h1>
      <button class="btn-back" @click="goHome">
        <i class="bi bi-arrow-left"></i>
        Quay lại
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải đơn hàng...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <h2>Chưa có đơn hàng</h2>
      <p>Bạn chưa tạo đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
      <button class="btn-primary" @click="goHome">
        <i class="bi bi-shop"></i>
        Tiếp tục mua sắm
      </button>
    </div>

    <!-- Orders List -->
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card" @click="goToOrderDetail(order.id)">
        
        <!-- Order Header -->
        <div class="order-header">
          <div class="order-code">
            <span class="label">Mã đơn hàng:</span>
            <span class="code">{{ order.orderCode }}</span>
          </div>
          <div class="order-status" :class="order.status.toLowerCase()">
            {{ getStatusLabel(order.status) }}
          </div>
        </div>

        <!-- Order Info -->
        <div class="order-info">
          <div class="info-row">
            <span class="label">Ngày tạo:</span>
            <span class="value">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Phương thức giao:</span>
            <span class="value">{{ getDeliveryLabel(order.deliveryMethod) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Phương thức thanh toán:</span>
            <span class="value">{{ order.paymentMethod }}</span>
          </div>
        </div>

        <!-- Order Amount -->
        <div class="order-amount">
          <span class="label">Tổng tiền:</span>
          <span class="amount">{{ formatPrice(order.totalAmount) }}</span>
        </div>

        <!-- View Detail Button -->
        <div class="order-action">
          <button class="btn-detail">
            <i class="bi bi-eye"></i>
            Xem chi tiết
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const orders = ref([])
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
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get status label
const getStatusLabel = (status) => {
  const statusMap = {
    'PENDING': '⏳ Đang chờ',
    'CONFIRMED': '✅ Đã xác nhận',
    'PROCESSING': '🔄 Đang xử lý',
    'SHIPPED': '📦 Đã gửi',
    'DELIVERED': '🎉 Đã giao',
    'CANCELLED': '❌ Đã hủy',
    'PAID': '💳 Đã thanh toán'
  }
  return statusMap[status] || status
}

// Get delivery label
const getDeliveryLabel = (deliveryMethod) => {
  const deliveryMap = {
    'DELIVERY': '🚚 Giao hàng',
    'PICKUP': '🏪 Lấy tại cửa hàng'
  }
  return deliveryMap[deliveryMethod] || deliveryMethod
}

// Load orders
const loadOrders = async () => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('accessToken')
    
    const response = await axios.get(
      'http://localhost:3000/orders',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    console.log('Orders response:', response.data)

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Filter để chỉ hiển thị DELIVERY (không hiển thị PICKUP)
      orders.value = response.data.data.filter(order => order.deliveryMethod === 'DELIVERY')
    }
  } catch (error) {
    console.error('Lỗi load orders:', error)
    alert('❌ Lỗi tải danh sách đơn hàng. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

// Go to order detail
const goToOrderDetail = (orderId) => {
  router.push({
    name: 'OrderDetail',
    params: { orderId: orderId }
  })
}

// Go home
const goHome = () => {
  router.push('/')
}

// Load orders on mount
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.my-orders-container {
  max-width: 1200px; /* Increased max-width for 3 columns */
  margin: 40px auto;
  padding: 30px 20px;
  background: #f7f9fc; /* Lighter background */
  min-height: 100vh;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Header */
.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px; /* Slightly reduced margin */
  gap: 15px;
}

.orders-header h1 {
  font-size: 1.8rem; /* Slightly smaller font */
  color: #333;
  margin: 0;
}

.btn-back {
  background: #e0e6f0; /* Updated color */
  color: #4a5568; /* Darker text */
  border: none;
  padding: 8px 18px; /* Reduced padding */
  border-radius: 6px; /* Slightly smaller radius */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 6px; /* Reduced gap */
  font-weight: 500;
  font-size: 0.9rem;
}

.btn-back:hover {
  background: #cdd4e0; /* Darker hover */
  transform: translateY(-1px);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px; /* Reduced gap */
  padding: 50px 20px; /* Reduced padding */
  background: white;
  border-radius: 10px; /* Slightly smaller radius */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.spinner {
  width: 40px; /* Smaller spinner */
  height: 40px;
  border: 3px solid #e2e8f0; /* Lighter border */
  border-top: 3px solid #4a90e2; /* Primary blue */
  border-radius: 50%;
  animation: spin 0.8s linear infinite; /* Faster spin */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 0.95rem; /* Slightly smaller font */
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px; /* Reduced gap */
  padding: 60px 20px; /* Reduced padding */
  background: white;
  border-radius: 10px; /* Slightly smaller radius */
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-state i {
  font-size: 3.5rem; /* Smaller icon */
  color: #a0aec0; /* Muted color */
}

.empty-state h2 {
  font-size: 1.4rem; /* Smaller font */
  color: #333;
  margin: 0;
}

.empty-state p {
  color: #718096; /* Muted text color */
  margin: 0;
  font-size: 0.9rem; /* Smaller font */
}

.btn-primary {
  background: linear-gradient(135deg, #4a90e2 0%, #50e3c2 100%); /* New gradient */
  color: white;
  border: none;
  padding: 10px 25px; /* Reduced padding */
  border-radius: 6px; /* Slightly smaller radius */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 6px; /* Reduced gap */
  font-weight: 600;
  margin-top: 10px;
  font-size: 0.95rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

/* Orders List */
.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 3 items per row, min 300px */
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 10px; /* Slightly smaller radius */
  padding: 18px; /* Reduced padding */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Lighter shadow */
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid #e2e8f0; /* Lighter border */
  display: flex;
  flex-direction: column;
}

.order-card:hover {
  transform: translateY(-3px); /* Slightly less lift */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* More pronounced hover shadow */
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; /* Reduced margin */
  padding-bottom: 12px; /* Reduced padding */
  border-bottom: 1px solid #edf2f7; /* Lighter border */
}

.order-code {
  display: flex;
  flex-direction: column;
  gap: 3px; /* Reduced gap */
}

.order-code .label {
  font-size: 0.8rem; /* Smaller font */
  color: #999;
  font-weight: 500;
}

.order-code .code {
  font-family: 'Roboto Mono', monospace; /* Modern monospace font */
  font-weight: 600;
  color: #333;
  font-size: 0.9rem; /* Slightly smaller font */
}

.order-status {
  padding: 5px 10px; /* Reduced padding */
  border-radius: 16px; /* More rounded */
  font-size: 0.8rem; /* Smaller font */
  font-weight: 600;
  white-space: nowrap;
  text-transform: uppercase; /* Uppercase status */
}

.order-status.pending {
  background: #fffbe6; /* Lighter yellow */
  color: #b88a00; /* Darker yellow */
}

.order-status.confirmed {
  background: #e6ffed; /* Lighter green */
  color: #2d8a39; /* Darker green */
}

.order-status.paid {
  background: #e6ffed; /* Lighter green */
  color: #2d8a39; /* Darker green */
}

.order-status.processing {
  background: #e6f7ff; /* Lighter blue */
  color: #1890ff; /* Darker blue */
}

.order-status.shipped {
  background: #e6f7ff; /* Lighter blue */
  color: #1890ff; /* Darker blue */
}

.order-status.delivered {
  background: #e6ffed; /* Lighter green */
  color: #2d8a39; /* Darker green */
}

.order-status.cancelled {
  background: #fff1f0; /* Lighter red */
  color: #cf1322; /* Darker red */
}

/* Order Info */
.order-info {
  margin-bottom: 12px; /* Reduced margin */
  display: flex;
  flex-direction: column;
  gap: 8px; /* Reduced gap */
  flex-grow: 1; /* Allows it to take available space */
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem; /* Smaller font */
}

.info-row .label {
  color: #718096; /* Muted color */
  font-weight: 500;
}

.info-row .value {
  color: #333;
  font-weight: 600;
}

/* Order Amount */
.order-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px; /* Reduced padding */
  background: #f0f4f8; /* Lighter background */
  border-radius: 8px;
  margin-bottom: 12px; /* Reduced margin */
}

.order-amount .label {
  color: #718096; /* Muted color */
  font-weight: 500;
  font-size: 0.9rem;
}

.order-amount .amount {
  font-size: 1.2rem; /* Slightly smaller font */
  font-weight: 700;
  color: #4a90e2; /* Primary blue */
}

/* Order Action */
.order-action {
  display: flex;
  gap: 8px; /* Reduced gap */
}

.btn-detail {
  flex: 1;
  background: #E57905; /* New gradient */
  color: white;
  border: none;
  padding: 9px 12px; /* Reduced padding */  
  border-radius: 6px; /* Slightly smaller radius */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px; /* Reduced gap */
  font-weight: 600;
  font-size: 0.85rem; /* Smaller font */
}

.btn-detail:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 1024px) {
  .orders-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Adjust for smaller screens */
  }
}

@media (max-width: 768px) {
  .my-orders-container {
    padding: 25px 15px; /* Reduced padding */
    margin: 30px auto;
  }

  .orders-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .orders-header h1 {
    font-size: 1.6rem;
  }

  .orders-list {
    grid-template-columns: 1fr; /* Single column on small screens */
  }

  .order-card {
    padding: 15px; /* Reduced padding */
  }

  .btn-back, .btn-primary, .btn-detail {
    font-size: 0.8rem;
    padding: 8px 15px;
  }
}
</style>
