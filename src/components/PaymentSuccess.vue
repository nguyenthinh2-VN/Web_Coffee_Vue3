<template>
  <div class="payment-success-wrapper">
    <!-- Success State -->
    <div v-if="isSuccess" class="success-container">
      <div class="success-content">
        <!-- Animated Success Icon -->
        <div class="icon-container">
          <div class="checkmark-circle">
            <svg class="checkmark" viewBox="0 0 52 52">
              <circle class="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.6"/>
            </svg>
          </div>
        </div>

        <!-- Success Message -->
        <h1 class="success-title">Thanh toán thành công!</h1>
        <p class="success-subtitle">Cảm ơn bạn đã tin tưởng The Coffee House</p>
        <p class="success-description">Đơn hàng của bạn đã được xác nhận và sẽ được chuẩn bị ngay.</p>

        <!-- Order Info -->
        <div class="order-note" v-if="decodedOrderInfo">
          <p class="note-label">Ghi chú:</p>
          <p class="note-value">{{ decodedOrderInfo }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button class="btn btn-home" @click="goToHome">
            <i class="bi bi-house-fill"></i> Trang chủ
          </button>
          <button class="btn btn-orders" @click="goToOrders">
            <i class="bi bi-bag-check-fill"></i> Xem đơn hàng
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <div class="error-content">
        <!-- Error Icon -->
        <div class="icon-container error">
          <div class="error-circle">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>

        <!-- Error Message -->
        <h1 class="error-title">Thanh toán thất bại</h1>
        <p class="error-subtitle">{{ errorMessage }}</p>
        
        <div class="error-code" v-if="responseCode">
          <small>Mã lỗi: {{ responseCode }}</small>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button class="btn btn-home" @click="goToHome">
            <i class="bi bi-house-fill"></i> Quay lại trang chủ
          </button>
          <button class="btn btn-retry" @click="goToCheckout">
            <i class="bi bi-arrow-clockwise"></i> Thử lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { getApiUrl } from '@/api';

const router = useRouter();
const route = useRoute();

const isSuccess = ref(false);
const responseCode = ref('');
const orderInfo = ref('');
const decodedOrderInfo = ref('');
const errorMessage = ref('');

const errorMessages = {
  '01': 'Giao dịch bị từ chối',
  '02': 'Giao dịch bị lỗi',
  '03': 'Số tiền không hợp lệ',
  '04': 'Tài khoản không tồn tại',
  '05': 'Tài khoản bị khóa',
  '06': 'Mật khẩu sai',
  '07': 'Giao dịch bị hủy',
  '08': 'Thời gian giao dịch hết hạn',
  '09': 'Giao dịch không được hỗ trợ',
  '10': 'Lỗi hệ thống',
  '99': 'Giao dịch đang xử lý'
};

// Hàm decode URL encoded string
const decodeOrderInfo = (encodedStr) => {
  try {
    return decodeURIComponent(encodedStr);
  } catch (e) {
    console.error('Error decoding order info:', e);
    return encodedStr;
  }
};

// Hàm gọi API vnpay-callback
const callVnpayCallback = async () => {
  try {
    // Lấy tất cả query parameters từ URL
    const queryParams = new URLSearchParams(window.location.search);
    const callbackUrl = `${getApiUrl('/orders/vnpay-callback')}?${queryParams.toString()}`;
    
    console.log('Calling vnpay-callback API:', callbackUrl);
    
    const response = await axios.get(callbackUrl);
    console.log('Vnpay callback response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error calling vnpay-callback:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    // Không throw error, vì trang vẫn hiển thị được
  }
};

onMounted(async () => {
  // Lấy query parameters từ URL
  const vnpResponseCode = route.query.vnp_ResponseCode;
  const vnpOrderInfo = route.query.vnp_OrderInfo;
  const vnpTxnRef = route.query.vnp_TxnRef;

  responseCode.value = vnpResponseCode || '';
  orderInfo.value = vnpOrderInfo || vnpTxnRef || '';
  
  // Decode OrderInfo nếu có
  if (vnpOrderInfo) {
    decodedOrderInfo.value = decodeOrderInfo(vnpOrderInfo);
  }

  // Kiểm tra mã response
  if (vnpResponseCode === '00') {
    isSuccess.value = true;
    console.log('Payment successful:', { vnpOrderInfo, decodedOrderInfo: decodedOrderInfo.value, vnpTxnRef });
    
    // Gọi API vnpay-callback để xác nhận thanh toán với backend
    await callVnpayCallback();
  } else {
    isSuccess.value = false;
    errorMessage.value = errorMessages[vnpResponseCode] || 'Thanh toán thất bại. Vui lòng thử lại.';
    console.log('Payment failed:', { vnpResponseCode, errorMessage: errorMessage.value });
  }
});

const goToHome = () => {
  router.push('/');
};

const goToOrders = () => {
  router.push('/my-orders');
};

const goToCheckout = () => {
  router.push('/checkout');
};
</script>

<style scoped>
/* ===== MAIN WRAPPER ===== */
.payment-success-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ===== SUCCESS CONTAINER ===== */
.success-container,
.error-container {
  width: 100%;
  max-width: 550px;
  animation: fadeInScale 0.6s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-content,
.error-content {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* ===== ICON CONTAINER ===== */
.icon-container {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.checkmark-circle {
  width: 120px;
  height: 120px;
  position: relative;
}

.checkmark {
  width: 100%;
  height: 100%;
  animation: scaleIn 0.6s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.checkmark-circle-bg {
  stroke: #28a745;
  stroke-width: 2;
  animation: strokeAnimation 0.6s ease-out forwards;
  stroke-dasharray: 157;
  stroke-dashoffset: 157;
}

@keyframes strokeAnimation {
  0% {
    stroke-dashoffset: 157;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.checkmark-check {
  stroke: #28a745;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: checkAnimation 0.6s ease-out 0.3s forwards;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
}

@keyframes checkAnimation {
  0% {
    stroke-dashoffset: 48;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.icon-container.error {
  margin-bottom: 30px;
}

.error-circle {
  width: 100px;
  height: 100px;
  background: #f8d7da;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: shake 0.5s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.error-icon {
  width: 60px;
  height: 60px;
  color: #dc3545;
}

/* ===== TEXT CONTENT ===== */
.success-title,
.error-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 15px 0;
  letter-spacing: -0.5px;
}

.success-title {
  color: black;
  background: black;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  color: #dc3545;
}

.success-subtitle,
.error-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  letter-spacing: 0.3px;
}

.success-description {
  font-size: 15px;
  color: #666;
  margin: 0 0 30px 0;
  line-height: 1.8;
  font-weight: 500;
}

/* ===== ORDER NOTE ===== */
.order-note {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 4px solid #ff6b00;
  border-radius: 8px;
  padding: 16px 18px;
  margin-bottom: 30px;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.note-label {
  font-size: 12px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 6px 0;
}

.note-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  background: white;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.error-code {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 12px 15px;
  border-radius: 6px;
  margin: 20px 0 30px 0;
  text-align: left;
}

.error-code small {
  color: #856404;
  font-weight: 600;
  font-size: 13px;
}

/* ===== BUTTON GROUP ===== */
.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 40px;
}

.btn {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn i {
  font-size: 18px;
}

/* ===== BUTTON STYLES ===== */
.btn-home {
  color: black;
}

.btn-home:hover {
  transform: translateY(-3px);

}

.btn-home:active {
  transform: translateY(-1px);
}

.btn-orders {
  color: black;
}

.btn-orders:hover {
  transform: translateY(-3px);
}

.btn-orders:active {
  transform: translateY(-1px);
}

.btn-retry {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
}

.btn-retry:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
}

.btn-retry:active {
  transform: translateY(-1px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .success-content,
  .error-content {
    padding: 45px 25px;
  }

  .success-title,
  .error-title {
    font-size: 25px;
  }

  .success-subtitle,
  .error-subtitle {
    font-size: 16px;
  }

  .success-description {
    font-size: 14px;
  }

  .checkmark-circle {
    width: 100px;
    height: 100px;
  }

  .btn {
    padding: 12px 20px;
    font-size: 14px;
  }

  .button-group {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .payment-success-wrapper {
    padding: 15px;
  }

  .success-content,
  .error-content {
    padding: 35px 20px;
    border-radius: 16px;
  }

  .success-title,
  .error-title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .success-subtitle,
  .error-subtitle {
    font-size: 14px;
  }

  .success-description {
    font-size: 13px;
    margin-bottom: 30px;
  }

  .icon-container {
    margin-bottom: 25px;
  }

  .checkmark-circle {
    width: 80px;
    height: 80px;
  }

  .btn {
    padding: 11px 12px;
    font-size: 12px;
    gap: 6px;
  }

  .btn i {
    font-size: 14px;
  }

  .button-group {
    margin-top: 30px;
    gap: 8px;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
