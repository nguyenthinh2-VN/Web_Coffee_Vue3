<template>
  <div class="payment-callback-container">
    <div class="callback-card">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <h2>Đang xử lý thanh toán...</h2>
        <p>Vui lòng chờ trong giây lát</p>
      </div>
      
      <!-- Success State -->
      <div v-else-if="isSuccess" class="success-state">
        <div class="success-icon">
          <i class="bi bi-check-circle"></i>
        </div>
        
        <div class="success-content">
          <h1>Thanh toán thành công!</h1>
          <p>{{ message }}</p>
        </div>
        
        <div class="order-info">
          <div class="info-row">
            <span class="label">Mã đơn hàng:</span>
            <span class="value">{{ orderCode }}</span>
          </div>
          <div class="info-row">
            <span class="label">Số tiền:</span>
            <span class="value amount">{{ amount }}</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn-primary" @click="goToOrderSuccess">
            <i class="bi bi-receipt"></i>
            Xem chi tiết đơn hàng
          </button>
          <button class="btn-secondary" @click="goHome">
            <i class="bi bi-house"></i>
            Quay lại trang chủ
          </button>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else class="error-state">
        <div class="error-icon">
          <i class="bi bi-x-circle"></i>
        </div>
        
        <div class="error-content">
          <h1>Thanh toán thất bại</h1>
          <p>{{ message }}</p>
        </div>
        
        <div class="action-buttons">
          <button class="btn-primary" @click="goHome">
            <i class="bi bi-house"></i>
            Quay lại trang chủ
          </button>
          <button class="btn-secondary" @click="goBack">
            <i class="bi bi-arrow-left"></i>
            Quay lại
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

const isLoading = ref(true)
const isSuccess = ref(false)
const message = ref('')
const orderCode = ref('')
const amount = ref('')
const orderId = ref(null)

// Process callback
const processCallback = async () => {
  try {
    // Lấy query parameters từ URL
    const params = new URLSearchParams(window.location.search)
    const queryParamsString = params.toString()
    
    console.log('Callback params:', queryParamsString)

    // Gọi API callback tới backend
    const token = localStorage.getItem('accessToken')
    const response = await axios.post(
      `http://localhost:3000/orders/vnpay-callback?${queryParamsString}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Callback response:', response.data)

    // Extract info từ query params
    const orderInfo = params.get('vnp_OrderInfo')
    orderCode.value = orderInfo?.split(': ')[1] || 'N/A'
    const amountVND = parseInt(params.get('vnp_Amount')) / 100
    amount.value = new Intl.NumberFormat('de-DE').format(amountVND) + 'đ'

    // Lấy orderId từ vnp_TxnRef (mã đơn hàng)
    const txnRef = params.get('vnp_TxnRef')
    if (txnRef) {
      orderId.value = txnRef
    }

    // Check response - nếu success = true thì thanh toán thành công
    if (response.data && response.data.success) {
      isSuccess.value = true
      message.value = response.data.message || 'Thanh toán thành công!'
      
      // Tự động redirect sang OrderSuccess sau 1 giây
      setTimeout(() => {
        goToOrderSuccess()
      }, 1000)
    } else {
      isSuccess.value = false
      message.value = response.data?.message || 'Thanh toán thất bại. Vui lòng thử lại.'
    }
  } catch (error) {
    console.error('Lỗi xử lý callback:', error)
    isSuccess.value = false
    message.value = error.message || 'Có lỗi xảy ra khi xử lý thanh toán.'
  } finally {
    isLoading.value = false
  }
}

// Go to order success
const goToOrderSuccess = () => {
  if (orderId.value) {
    router.push({
      name: 'OrderSuccess',
      params: { orderId: orderId.value }
    })
  } else {
    router.push('/')
  }
}

// Go home
const goHome = () => {
  router.push('/')
}

// Go back
const goBack = () => {
  router.go(-1)
}

// Process callback on mount
onMounted(() => {
  processCallback()
})
</script>

<style scoped>
.payment-callback-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.callback-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  padding: 40px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.loading-state p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

/* Success State */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.success-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.success-content h1 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 10px 0;
}

.success-content p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.order-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.value.amount {
  color: #28a745;
  font-size: 1.1rem;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.error-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  animation: scaleIn 0.5s ease-out;
}

.error-content h1 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 10px 0;
}

.error-content p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.btn-primary,
.btn-secondary {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
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
  .callback-card {
    padding: 30px 20px;
  }

  .success-icon,
  .error-icon {
    width: 80px;
    height: 80px;
    font-size: 3rem;
  }

  .success-content h1,
  .error-content h1 {
    font-size: 1.5rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 12px 20px;
    font-size: 0.95rem;
  }
}
</style>
