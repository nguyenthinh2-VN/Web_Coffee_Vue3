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
  max-width: 1000px;
  margin: 50px auto;
  padding: 40px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.orders-header h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.btn-back {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.btn-back:hover {
  background: #e0e0e0;
  border-color: #999;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  color: #ccc;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.empty-state p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-top: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Orders List */
.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.order-code {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-code .label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}

.order-code .code {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #333;
  font-size: 0.95rem;
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-status.confirmed {
  background: #d4edda;
  color: #155724;
}

.order-status.paid {
  background: #d4edda;
  color: #155724;
}

.order-status.processing {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status.shipped {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status.delivered {
  background: #d4edda;
  color: #155724;
}

.order-status.cancelled {
  background: #f8d7da;
  color: #721c24;
}

/* Order Info */
.order-info {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.info-row .label {
  color: #666;
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
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.order-amount .label {
  color: #666;
  font-weight: 500;
}

.order-amount .amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
}

/* Order Action */
.order-action {
  display: flex;
  gap: 10px;
}

.btn-detail {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-detail:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .my-orders-container {
    padding: 20px 15px;
  }

  .orders-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .orders-header h1 {
    font-size: 1.5rem;
  }

  .orders-list {
    grid-template-columns: 1fr;
  }

  .order-card {
    padding: 15px;
  }
}
</style>
