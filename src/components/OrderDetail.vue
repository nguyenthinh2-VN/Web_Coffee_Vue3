<template>
  <div class="order-detail-container">
    <div class="detail-header">
      <button class="btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i>
        Quay lại
      </button>
      <h1>Chi Tiết Đơn Hàng</h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải chi tiết đơn hàng...</p>
    </div>

    <!-- Order Detail -->
    <div v-else-if="order" class="detail-content">
      
      <!-- Order Header -->
      <div class="section order-header-section">
        <div class="header-top">
          <div class="order-code">
            <span class="label">Mã đơn hàng:</span>
            <span class="code">{{ order.orderCode }}</span>
          </div>
          <div class="order-status" :class="order.status.toLowerCase()">
            {{ getStatusLabel(order.status) }}
          </div>
        </div>
        <div class="header-info">
          <div class="info-item">
            <span class="label">Ngày tạo:</span>
            <span class="value">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Cập nhật:</span>
            <span class="value">{{ formatDate(order.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Delivery Address -->
      <div class="section">
        <h2>Địa Chỉ Giao Hàng</h2>
        <div v-if="order.address" class="address-info">
          <div class="address-row">
            <span class="label">Tên:</span>
            <span class="value">{{ order.address.fullName }}</span>
          </div>
          <div class="address-row">
            <span class="label">Điện thoại:</span>
            <span class="value">{{ order.address.phone }}</span>
          </div>
          <div class="address-row">
            <span class="label">Địa chỉ:</span>
            <span class="value">{{ order.address.fullAddress }}</span>
          </div>
          <div class="address-row">
            <span class="label">Quận/Huyện:</span>
            <span class="value">{{ order.address.district }}</span>
          </div>
          <div class="address-row">
            <span class="label">Thành phố:</span>
            <span class="value">{{ order.address.city }}</span>
          </div>
        </div>
        <div v-else class="no-data">
          Không có thông tin địa chỉ
        </div>
      </div>

      <!-- Order Items -->
      <div class="section">
        <h2>Sản Phẩm</h2>
        <div class="items-table">
          <div class="table-header">
            <div class="col-product">Sản Phẩm</div>
            <div class="col-size">Kích Cỡ</div>
            <div class="col-qty">Số Lượng</div>
            <div class="col-price">Giá</div>
            <div class="col-total">Thành Tiền</div>
          </div>
          <div v-for="item in order.items" :key="item.id" class="table-row">
            <div class="col-product">
              <div class="product-name">{{ item.productName }}</div>
              <div v-if="item.toppingNames" class="product-toppings">
                Topping: {{ item.toppingNames }}
              </div>
              <div class="product-ice">
                {{ item.iceOptionName }}
              </div>
            </div>
            <div class="col-size">{{ item.sizeName }}</div>
            <div class="col-qty">{{ item.quantity }}</div>
            <div class="col-price">{{ formatPrice(item.price) }}</div>
            <div class="col-total">{{ formatPrice(item.subtotal) }}</div>
          </div>
        </div>
      </div>

      <div class="bottom-section">
        <!-- Order Summary -->
        <div class="section">
          <h2>Tóm Tắt Đơn Hàng</h2>
          <div class="summary-info">
            <div class="summary-row">
              <span class="label">Tạm tính:</span>
              <span class="value">{{ formatPrice(calculateSubtotal()) }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Thuế:</span>
              <span class="value">{{ formatPrice(order.tax) }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Phí giao hàng:</span>
              <span class="value">{{ formatPrice(order.shippingFee) }}</span>
            </div>
            <div v-if="order.discount > 0" class="summary-row discount">
              <span class="label">Giảm giá:</span>
              <span class="value">-{{ formatPrice(order.discount) }}</span>
            </div>
            <div class="summary-row total">
              <span class="label">Tổng cộng:</span>
              <span class="value">{{ formatPrice(order.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Order Info -->
        <div class="section">
          <h2>Thông Tin Đơn Hàng</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Phương thức giao:</span>
              <span class="value">{{ getDeliveryLabel(order.deliveryMethod) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Phương thức thanh toán:</span>
              <span class="value">{{ order.paymentMethod }}</span>
            </div>
            <div v-if="order.voucherCode" class="info-item">
              <span class="label">Mã voucher:</span>
              <span class="value">{{ order.voucherCode }}</span>
            </div>
            <div v-if="order.notes" class="info-item full-width">
              <span class="label">Ghi chú:</span>
              <span class="value">{{ order.notes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="section action-buttons">
        <button class="btn-primary" @click="goToMyOrders">
          <i class="bi bi-list"></i>
          Quay lại danh sách
        </button>
        <button class="btn-secondary" @click="goHome">
          <i class="bi bi-house"></i>
          Trang chủ
        </button>
      </div>

    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <i class="bi bi-exclamation-circle"></i>
      <h2>Không tìm thấy đơn hàng</h2>
      <p>Đơn hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <button class="btn-primary" @click="goToMyOrders">
        <i class="bi bi-arrow-left"></i>
        Quay lại danh sách
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const order = ref(null)
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

// Calculate subtotal
const calculateSubtotal = () => {
  if (!order.value || !order.value.items) return 0
  return order.value.items.reduce((sum, item) => sum + item.subtotal, 0)
}

// Load order detail
const loadOrderDetail = async () => {
  try {
    isLoading.value = true
    const orderId = route.params.orderId
    const token = localStorage.getItem('accessToken')
    
    const response = await axios.get(
      `http://localhost:3000/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    console.log('Order detail response:', response.data)

    if (response.data && response.data.data) {
      order.value = response.data.data
    }
  } catch (error) {
    console.error('Lỗi load order detail:', error)
    alert('❌ Lỗi tải chi tiết đơn hàng. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

// Go back
const goBack = () => {
  router.go(-1)
}

// Go to my orders
const goToMyOrders = () => {
  router.push({
    name: 'MyOrders'
  })
}

// Go home
const goHome = () => {
  router.push('/')
}

// Load order detail on mount
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped>
.order-detail-container {
  max-width: 1000px;
  margin: 50px auto;
  padding: 40px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
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
  white-space: nowrap;
}

.btn-back:hover {
  background: #e0e0e0;
  border-color: #999;
}

.detail-header h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.error-state i {
  font-size: 4rem;
  color: #dc3545;
}

.error-state h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.error-state p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

/* Detail Content */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section h2 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

/* Order Header Section */
.order-header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.order-header-section h2 {
  display: none;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-code {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-code .label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.order-code .code {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 1.2rem;
}

.order-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.order-status.pending {
  background: #ffecb3; /* Light yellow */
  color: #664d03; /* Darker yellow text */
}

.order-status.confirmed,
.order-status.delivered,
.order-status.paid {
  background: #d4edda; /* Light green */
  color: #0f5132; /* Darker green text */
}

.order-status.processing {
  background: #cfe2ff; /* Light blue */
  color: #055160; /* Darker blue text */
}

.order-status.shipped {
  background: #cff4fc; /* Light cyan */
  color: #0a58ca; /* Darker cyan text */
}

.order-status.cancelled {
  background: #f8d7da; /* Light red */
  color: #842029; /* Darker red text */
}

.header-info {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.header-info .info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.header-info .label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.header-info .value {
  font-weight: 600;
  font-size: 0.95rem;
}

/* Address Info */
.address-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #f0f2f5; /* Slightly darker than f8f9fa */
  border-radius: 8px;
}

.address-row .label {
  color: #666;
  font-weight: 500;
  min-width: 100px;
}

.address-row .value {
  color: #333;
  font-weight: 600;
  text-align: right;
  flex: 1;
}

/* Items Table */
.items-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 10px; /* Reduced padding */
  padding: 10px 15px; /* Reduced padding */
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 10px; /* Reduced padding */
  padding: 10px 15px; /* Reduced padding */
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.col-product {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.product-name {
  font-weight: 600;
  color: #333;
}

.product-toppings {
  font-size: 0.85rem;
  color: #666;
}

.product-ice {
  font-size: 0.85rem;
  color: #999;
}

.col-size,
.col-qty,
.col-price,
.col-total {
  text-align: right;
  color: #333;
}

/* Bottom Section */
.bottom-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Summary Info */
.summary-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background: #f0f2f5; /* Slightly darker than f8f9fa */
  border-radius: 8px;
}

.summary-row .label {
  color: #666;
  font-weight: 500;
}

.summary-row .value {
  color: #333;
  font-weight: 600;
}

.summary-row.discount .value {
  color: #28a745;
}

.summary-row.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  font-size: 1.1rem;
  border-radius: 8px; /* Ensure total row also has border-radius */
}

.summary-row.total .label,
.summary-row.total .value {
  color: white;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 15px;
  background: #f0f2f5; /* Slightly darker than f8f9fa */
  border-radius: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item .label {
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

.info-item .value {
  color: #333;
  font-weight: 600;
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e9ecef; /* Softer background */
  color: #333;
  border: 1px solid #ced4da; /* Softer border */
}

.btn-secondary:hover {
  background: #dee2e6; /* Slightly darker on hover */
  border-color: #adb5bd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow on hover */
}

/* No Data */
.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
  background: #f0f2f5; /* Consistent background */
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .order-detail-container {
    padding: 20px 15px;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-header h1 {
    font-size: 1.5rem;
  }

  .section {
    padding: 15px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 8px 15px; /* Adjusted for smaller screens */
  }

  .col-size,
  .col-qty,
  .col-price,
  .col-total {
    text-align: left;
  }

  .bottom-section {
    grid-template-columns: 1fr; /* Stack sections on small screens */
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
