<template>
  <div class="checkout-container">
    <div class="checkout-header">
      <h1 class="checkout-title">
        <i class="bi bi-credit-card"></i>
        Thanh Toán Đơn Hàng
      </h1>
      <button class="btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i>
        Quay lại giỏ hàng
      </button>
    </div>

    <!-- Ghi chú: Hiển thị thông tin đơn hàng từ giỏ hàng -->
    <div class="checkout-content">
      <!-- QR Thanh toán -->
      <div class="payment-section">
        <h2 class="section-title">
          <i class="bi bi-qr-code"></i>
          Quét Mã QR Để Thanh Toán
        </h2>
        
        <!-- Ghi chú: Hiển thị QR ngay khi vào trang -->
        <div class="vietqr-section">
          <div class="qr-container">
            <div class="qr-code">
              <img :src="vietqrQR" alt="VietQR QR Code" />
            </div>
            <div class="qr-instructions">
              <p><strong>Hướng dẫn thanh toán:</strong></p>
              <ol>
                <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                <li>Chọn chức năng quét QR</li>
                <li>Quét mã QR trên để thanh toán</li>
                <li>Kiểm tra số tiền và xác nhận</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin đơn hàng -->
      <div class="order-section">
        <h2 class="section-title">
          <i class="bi bi-bag-check"></i>
          Thông Tin Đơn Hàng
          <span class="item-count-badge">{{ totalItems }} sản phẩm</span>
        </h2>
        
        <div class="order-items">
          <div v-for="(item, index) in orderItems" :key="index" class="order-item">
            <img :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h3 class="item-name">
                {{ item.name }}
                <span class="item-qty-badge">x{{ item.quantity }}</span>
              </h3>
              
              <!-- Ghi chú: Hiển thị các tùy chọn đã chọn -->
              <div class="item-options" v-if="hasOptions(item)">
                <div v-if="item.size" class="option-tag">
                  <i class="bi bi-cup"></i>
                  Size: {{ item.size }}
                </div>
                <div v-if="item.toppings && item.toppings.length > 0" class="option-tag">
                  <i class="bi bi-plus-circle"></i>
                  Topping: {{ item.toppings.join(', ') }}
                </div>
                <div v-if="item.ice" class="option-tag">
                  <i class="bi bi-snow"></i>
                  Độ đá: {{ item.ice }}
                </div>
              </div>
              
              <div class="item-pricing">
                <span class="item-quantity">Số lượng: {{ item.quantity }}</span>
                <span class="item-price">{{ formatPrice(item.price) }}</span>
                <span class="item-total">Thành tiền: {{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tổng tiền -->
        <div class="order-summary">
          <div class="summary-row">
            <span>Tổng số lượng sản phẩm:</span>
            <span>{{ totalItems }}</span>
          </div>
          <div class="summary-row">
            <span>Tạm tính:</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{{ formatPrice(shippingFee) }}</span>
          </div>
          <div class="summary-row total-row">
            <span>Tổng cộng:</span>
            <span class="total-amount">{{ formatPrice(totalAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Thông tin khách hàng -->
      <div class="customer-section">
        <h2 class="section-title">
          <i class="bi bi-person"></i>
          Thông Tin Khách Hàng
        </h2>
        
        <form class="customer-form" @submit.prevent="processPayment">
          <div class="form-group">
            <label for="customerName">Họ và tên *</label>
            <input 
              type="text" 
              id="customerName" 
              v-model="customerInfo.name" 
              required 
              placeholder="Nhập họ và tên"
            />
          </div>
          <div class="form-group">
            <label for="customerEmail">Email *</label>
            <input 
              type="email" 
              id="customerEmail" 
              v-model="customerInfo.email" 
              required 
              placeholder="Nhập địa chỉ email"
              :disabled="authStore.userEmail"
            />
          </div>
          <div class="form-group">
            <label for="customerPhone">Số điện thoại *</label>
            <input 
              type="tel" 
              id="customerPhone" 
              v-model="customerInfo.phone" 
              required 
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div class="form-group">
            <label for="customerAddress">Địa chỉ giao hàng *</label>
            <textarea 
              id="customerAddress" 
              v-model="customerInfo.address" 
              required 
              placeholder="Nhập địa chỉ giao hàng"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="customerNote">Ghi chú (tùy chọn)</label>
            <textarea 
              id="customerNote" 
              v-model="customerInfo.note" 
              placeholder="Ghi chú thêm cho đơn hàng"
              rows="2"
            ></textarea>
          </div>
        </form>
      </div>

      <!-- Nút xác nhận -->
      <div class="checkout-actions">
        <button 
          type="button" 
          class="btn-confirm" 
          @click="processPayment"
          :disabled="!isFormValid"
        >
          <i class="bi bi-check-circle"></i>
          Xác Nhận Thanh Toán
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getApiUrl, API_ENDPOINTS } from '@/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Ghi chú: Dữ liệu đơn hàng được truyền từ giỏ hàng
const orderItems = ref([])
const customerInfo = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  note: ''
})

//const paymentMethod = ref('vietqr') // Mặc định là VietQR
const shippingFee = ref(10000) // Phí ship cố định 25k

// Ghi chú: Tính toán các giá trị tổng
const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const totalAmount = computed(() => {
  return subtotal.value + shippingFee.value
})

// Tổng số lượng sản phẩm
const totalItems = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
})

// Ghi chú: Tạo QR VietQR thật sử dụng API VietQR chính thức
const vietqrQR = computed(() => {
  const bankId = '970407' // TechcomBank
  const accountNo = '4933222222'
  const template = 'compact2'
  const amount = totalAmount.value
  const description = `Coffee Shop Order ${new Date().getTime()}`
  const accountName = 'NGUYEN DUC THINH'
  
  const vietqrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`
  
  return vietqrUrl
})

// Ghi chú: Kiểm tra form hợp lệ
const isFormValid = computed(() => {
  return customerInfo.value.name.trim() !== '' &&
         customerInfo.value.email.trim() !== '' &&
         customerInfo.value.phone.trim() !== '' && 
         customerInfo.value.address.trim() !== ''
})

// Ghi chú: Helper functions
const hasOptions = (item) => {
  return item.size || (item.toppings && item.toppings.length > 0) || item.ice
}

const formatPrice = (price) => {
  if (typeof price !== 'number') return ''
  return new Intl.NumberFormat('de-DE').format(price) + 'đ'
}

const goBack = () => {
  cartStore.isOpen = true
  router.go(-1)
}

// Ghi chú: Xử lý thanh toán và lưu đơn hàng vào database
const processPayment = async () => {
  if (!isFormValid.value) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc!')
    return
  }

  const orderData = {
    userId: authStore.userEmail ? Math.floor(Math.random() * 1000000) : null,
    userEmail: authStore.userEmail,
    userName: authStore.userName,
    customerInfo: {
      name: customerInfo.value.name,
      phone: customerInfo.value.phone,
      address: customerInfo.value.address
    },
    items: orderItems.value.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      size: item.size,
      toppings: item.toppings || [],
      ice: item.ice,
      price: item.price,
      quantity: item.quantity
    })),
    totalAmount: totalAmount.value,
    paymentMethod: 'VietQR',
    status: 'pending_payment',
    createdAt: new Date().toISOString(),
    notes: customerInfo.value.note || ''
  }

  console.log('Đơn hàng được tạo:', orderData)

  const confirmed = confirm('✅ Đơn hàng đã được tạo!\n\nVui lòng quét mã QR để thanh toán.\n\nBấm "OK" sau khi đã thanh toán thành công để hoàn tất đơn hàng.')
  
  if (confirmed) {
    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.ORDERS), orderData, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      console.log('Đơn hàng đã được lưu:', response.data)
      
      const completedOrderData = {
        ...orderData,
        status: 'completed',
        completedAt: new Date().toISOString()
      }
      
      await axios.put(`${getApiUrl(API_ENDPOINTS.ORDERS)}/${response.data.id}`, completedOrderData, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      cartStore.clearCart()
      cartStore.isOpen = false
      
      alert(`✨ Cảm ơn bạn đã đặt hàng!\n\nMã đơn hàng: #${response.data.id}\nĐơn hàng sẽ được xử lý sớm nhất.`)
      router.push('/')
      
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error)
      alert('❌ Có lỗi xảy ra. Vui lòng thử lại!')
    }
  }
}



// Hàm fetch địa chỉ mới nhất bằng for và n-1
const fetchLatestAddress = async () => { // Định nghĩa hàm bất đồng bộ để lấy địa chỉ mới nhất từ db.json
  if (authStore.userEmail) { // Kiểm tra xem người dùng đã đăng nhập (có email không)
    try {
      const cacheBuster = Date.now() // Tạo timestamp để tránh cache từ trình duyệt
      const response = await axios.get(`${getApiUrl(API_ENDPOINTS.ORDERS)}?userEmail=${encodeURIComponent(authStore.userEmail)}&status=completed&_sort=createdAt&_order=desc&_=${cacheBuster}`, { // Gửi yêu cầu GET đến API, lọc đơn hàng hoàn tất, sắp xếp giảm dần theo createdAt, thêm cacheBuster
        headers: { 'Cache-Control': 'no-cache' } // Thêm header để yêu cầu không dùng cache
      })
      console.log('API Response:', response.data) // In ra console dữ liệu trả về từ API để debug
      if (response.data.length > 0) { // Kiểm tra xem danh sách đơn hàng có phần tử không
        // Sử dụng for để lấy bản ghi cuối cùng (n-1)
        let latestAddress = '' // Khởi tạo biến để lưu địa chỉ mới nhất, ban đầu để trống
        for (let i = response.data.length - 1; i >= 0; i--) { // Duyệt ngược từ cuối mảng về đầu
          latestAddress = response.data[i].customerInfo.address // Gán địa chỉ từ bản ghi hiện tại
          break // Dừng vòng lặp khi lấy được đầu tiên
        }
        customerInfo.value.address = latestAddress // Cập nhật địa chỉ vào reactive object customerInfo
        console.log('Địa chỉ mới nhất:', customerInfo.value.address) // In ra console địa chỉ mới nhất để debug
      } else {
        console.log('Không tìm thấy đơn hàng hoàn tất.')
      }
    } catch (error) {
      console.error('Lỗi fetch địa chỉ:', error) // Bắt và in lỗi
    }
  }
}



// Ghi chú: Khởi tạo dữ liệu khi component được mount
onMounted(async () => { // Chạy khi component được mount, cho phép xử lý bất đồng bộ
  if (cartStore.items.length === 0) { // Kiểm tra nếu giỏ hàng trống
    alert('Giỏ hàng trống! Chuyển về trang chủ.') // Hiển thị cảnh báo
    router.push('/') // Chuyển hướng về trang chủ
    return // Dừng thực thi hàm nếu giỏ hàng trống
  }
  
  orderItems.value = [...cartStore.items] // Sao chép dữ liệu giỏ hàng vào orderItems (reactive)
  console.log('Dữ liệu đơn hàng:', orderItems.value) // In ra console dữ liệu đơn hàng để debug
  customerInfo.value.name = authStore.userName || '' 
  customerInfo.value.email = authStore.userEmail || ''
  await fetchLatestAddress() // Gọi hàm lấy địa chỉ mới nhất và chờ kết quả
})

// Theo dõi thay đổi giỏ hàng
watch(() => cartStore.items, async () => { // Theo dõi thay đổi trong cartStore.items, xử lý bất đồng bộ
  await fetchLatestAddress() // Gọi lại hàm lấy địa chỉ mới nhất khi giỏ hàng thay đổi
}, { deep: true, immediate: true }) // deep: theo dõi thay đổi sâu, immediate: chạy ngay khi mount
</script>



<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.checkout-title {
  color: #333;
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkout-title i {
  color: #ff6b00;
}

.btn-back {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #5a6268;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* Ghi chú: QR section ở đầu trang */
.payment-section {
  grid-column: 1 / -1;
  order: -1;
}

.order-section,
.customer-section,
.payment-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}



.section-title {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid #ff6b00;
  padding-bottom: 10px;
}

.section-title i {
  color: #ff6b00;
}

.item-count-badge {
  margin-left: auto;
  background: #fff3e0;
  color: #ff6b00;
  border: 1px solid #ff6b00;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Ghi chú: Styles cho danh sách sản phẩm */
.order-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 10px 8px;
}

.item-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.option-tag {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.option-tag i {
  color: #ff6b00;
}

.item-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.item-total {
  font-weight: 600;
  color: #ff6b00;
}

/* Ghi chú: Styles cho tổng kết đơn hàng */
.order-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total-row {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff6b00;
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
}

/* Ghi chú: Styles cho form thông tin khách hàng */
.customer-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b00;
}

/* Ghi chú: Styles cho VietQR */
.vietqr-section {
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  text-align: center;
  border: 2px solid #ff6b00;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.1);
}

.qr-container h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.qr-code {
  margin: 25px 0;
  display: flex;
  justify-content: center;
}

.qr-code img {
  border: 3px solid #ff6b00;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  background: white;
  padding: 10px;
}

.qr-amount {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ff6b00;
  margin: 15px 0;
  background: white;
  padding: 10px 20px;
  border-radius: 25px;
  display: inline-block;
  border: 2px solid #ff6b00;
}

.qr-instructions {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.qr-instructions p {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1rem;
}

.qr-instructions ol {
  margin: 0;
  padding-left: 20px;
  color: #555;
}

.qr-instructions li {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* Ghi chú: Styles cho nút xác nhận */
.checkout-actions {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 20px;
}

.btn-confirm {
  background: #ff6b00;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
}

.btn-confirm:hover:not(:disabled) {
  background: #e55a00;
}

.btn-confirm:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Ghi chú: Responsive design */
@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .checkout-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .item-pricing {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>