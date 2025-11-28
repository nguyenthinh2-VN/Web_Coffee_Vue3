<template>
  <div class="order-preview-container">
    <!-- Header -->
    <div class="preview-header">
      <h1 class="preview-title">
        <i class="bi bi-eye"></i>
        Xem Trước Đơn Hàng
      </h1>
      <button class="btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i>
        Quay lại
      </button>
    </div>

    <div class="preview-content">
      <!-- Section 1: Địa Chỉ Giao Hàng -->
      <div class="section address-section">
        <h2 class="section-title">
          <i class="bi bi-geo-alt"></i>
          Địa Chỉ Giao Hàng
        </h2>
        
        <div class="address-display" v-if="selectedAddress">
          <div class="address-info">
            <p class="address-name">
              <strong>{{ selectedAddress.fullName }}</strong>
              <span class="address-phone">{{ selectedAddress.phone }}</span>
            </p>
            <p class="address-detail">{{ selectedAddress.fullAddress }}</p>
            <p class="address-location">{{ selectedAddress.district }}, {{ selectedAddress.city }}</p>
          </div>
          <div class="address-actions">
            <button class="btn-change" @click="openAddressModal">
              <i class="bi bi-pencil"></i>
              Thay Đổi
            </button>
            <button class="btn-add" @click="goToAddAddress" disabled>
              <i class="bi bi-plus"></i>
              Thêm Địa Chỉ
            </button>
          </div>
        </div>

        <div class="loading-state" v-else>
          <p>Đang tải địa chỉ...</p>
        </div>
      </div>

      <!-- Modal Chọn Địa Chỉ -->
      <div class="modal-overlay" v-if="showAddressModal" @click.self="closeAddressModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Chọn Địa Chỉ Giao Hàng</h3>
            <button class="btn-close" @click="closeAddressModal">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="address-list">
              <div 
                v-for="addr in addresses" 
                :key="addr.id" 
                class="address-item"
                :class="{ active: selectedAddress?.id === addr.id }"
                @click="selectAddress(addr)"
              >
                <div class="address-radio">
                  <input 
                    type="radio" 
                    :id="`addr-${addr.id}`"
                    :checked="selectedAddress?.id === addr.id"
                    @change="selectAddress(addr)"
                  />
                </div>
                <div class="address-item-info">
                  <p class="item-name">{{ addr.fullName }} - {{ addr.phone }}</p>
                  <p class="item-address">{{ addr.fullAddress }}</p>
                  <p class="item-location">{{ addr.district }}, {{ addr.city }}</p>
                  <span v-if="addr.isDefault" class="badge-default">Mặc định</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-confirm" @click="closeAddressModal">Xác Nhận</button>
          </div>
        </div>
      </div>

      <!-- Section 2: Danh Sách Sản Phẩm -->
      <div class="section products-section">
        <h2 class="section-title">
          <i class="bi bi-bag"></i>
          Danh Sách Sản Phẩm
          <span class="item-count-badge">{{ cartItems.length }} sản phẩm</span>
        </h2>

        <div class="products-list">
          <div v-for="(item, index) in cartItems" :key="index" class="product-item">
            <img :src="item.image" :alt="item.name" class="product-image" />
            <div class="product-details">
              <h3 class="product-name">{{ item.name }}</h3>
              <div class="product-options">
                <span v-if="item.size" class="option-tag">
                  <i class="bi bi-cup"></i>
                  Size: {{ item.size }}
                </span>
                <span v-if="item.toppings && item.toppings.length > 0" class="option-tag">
                  <i class="bi bi-plus-circle"></i>
                  Topping: {{ item.toppings.join(', ') }}
                </span>
                <span v-if="item.ice" class="option-tag">
                  <i class="bi bi-snow"></i>
                  Đá: {{ item.ice }}
                </span>
              </div>
              <div class="product-pricing">
                <span class="qty">x{{ item.quantity }}</span>
                <span class="price">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Voucher -->
      <div class="section voucher-section">
        <h2 class="section-title">
          <i class="bi bi-ticket"></i>
          Mã Giảm Giá
        </h2>
        <div class="voucher-input-group">
          <input 
            v-model="voucherCode" 
            type="text" 
            placeholder="Nhập mã voucher (nếu có)"
            class="voucher-input"
          />
          <button class="btn-apply" @click="applyVoucher">Áp Dụng</button>
        </div>
        <p v-if="voucherCode" class="voucher-applied">
          <i class="bi bi-check-circle"></i>
          Mã voucher: {{ voucherCode }}
        </p>
      </div>

      <!-- Section 4: Phương Thức Giao Hàng -->
      <div class="section delivery-section">
        <h2 class="section-title">
          <i class="bi bi-truck"></i>
          Phương Thức Giao Hàng
        </h2>
        <div class="delivery-options">
          <label class="delivery-option">
            <input 
              v-model="deliveryMethod" 
              type="radio" 
              value="DELIVERY"
              disabled
            />
            <span class="option-label">
              <strong>Giao Hàng Tận Nơi</strong>
              <small>(Mặc định)</small>
            </span>
          </label>
        </div>
      </div>

      <!-- Section 5: Tóm Tắt Đơn Hàng -->
      <div class="section summary-section">
        <h2 class="section-title">
          <i class="bi bi-receipt"></i>
          Tóm Tắt Đơn Hàng
        </h2>
        <div class="summary-details">
          <div class="summary-row">
            <span>Tạm tính:</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{{ formatPrice(shippingFee) }}</span>
          </div>
          <div class="summary-row discount-row">
            <span>Giảm giá:</span>
            <span>-{{ formatPrice(discount) }}</span>
          </div>
          <div class="summary-row total-row">
            <span>Tổng cộng:</span>
            <span class="total-amount">{{ formatPrice(totalAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="preview-actions">
        <button 
          class="btn-confirm-payment" 
          @click="confirmAndProceed"
          :disabled="isLoading || !selectedAddress"
        >
          <i class="bi bi-check-circle"></i>
          {{ isLoading ? 'Đang xử lý...' : 'Xác Nhận & Thanh Toán' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/orderStore'
import axios from 'axios'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

// State
const addresses = ref([])
const selectedAddress = ref(null)
const showAddressModal = ref(false)
const voucherCode = ref('')
const deliveryMethod = ref('DELIVERY')
const isLoading = ref(false)

// State từ API preview
const previewData = ref({
  subtotal: 0,
  tax: 0,
  shippingFee: 0,
  discount: 0,
  totalAmount: 0
})

// Computed
const cartItems = computed(() => cartStore.items)

const subtotal = computed(() => {
  return previewData.value.subtotal || cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingFee = computed(() => previewData.value.shippingFee || 0)

const discount = computed(() => previewData.value.discount || 0)

const totalAmount = computed(() => previewData.value.totalAmount || (subtotal.value + shippingFee.value - discount.value))

// Methods
const formatPrice = (price) => {
  if (typeof price !== 'number') return ''
  return new Intl.NumberFormat('de-DE').format(price) + 'đ'
}

const goBack = () => {
  router.go(-1)
}

const goToAddAddress = () => {
  // Để sau
  alert('Chức năng thêm địa chỉ sẽ được cập nhật sớm')
}

const loadDefaultAddress = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    console.log('Token:', token)
    
    // Load địa chỉ mặc định
    const response = await axios.get('http://localhost:3000/addresses/default', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('Default address response:', response.data)
    
    if (response.data && response.data.data) {
      selectedAddress.value = response.data.data
      console.log('Default address loaded:', selectedAddress.value)
    } else if (response.data) {
      selectedAddress.value = response.data
      console.log('Default address loaded directly:', selectedAddress.value)
    }
  } catch (error) {
    console.error('Lỗi tải địa chỉ mặc định:', error)
    console.error('Error details:', error.response?.data)
  }
}

const loadAddresses = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await axios.get('http://localhost:3000/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('Addresses list response:', response.data)
    
    if (response.data && response.data.data) {
      addresses.value = response.data.data
      console.log('Addresses loaded:', addresses.value)
    }
  } catch (error) {
    console.error('Lỗi tải danh sách địa chỉ:', error)
    console.error('Error details:', error.response?.data)
  }
}

const openAddressModal = async () => {
  await loadAddresses()
  showAddressModal.value = true
}

const closeAddressModal = () => {
  showAddressModal.value = false
}

const selectAddress = (address) => {
  selectedAddress.value = address
}

const applyVoucher = async () => {
  if (!voucherCode.value.trim()) {
    alert('Vui lòng nhập mã voucher')
    return
  }

  if (!selectedAddress.value) {
    alert('Vui lòng chọn địa chỉ giao hàng trước')
    return
  }

  if (cartItems.value.length === 0) {
    alert('Giỏ hàng trống')
    return
  }

  isLoading.value = true

  try {
    // Chuẩn bị request body
    const requestBody = {
      items: cartItems.value.map(item => ({
        productId: item.id,
        sizeId: item.sizeId || 1,
        quantity: item.quantity,
        toppingIds: Array.isArray(item.toppingIds) ? item.toppingIds : [],
        iceOptionId: item.iceOptionId || 1,
        notes: item.notes || ''
      })),
      addressId: selectedAddress.value.id,
      voucherCode: voucherCode.value,
      deliveryMethod: deliveryMethod.value
    }

    console.log('Applying voucher with request:', requestBody)

    // Gọi API preview
    const token = localStorage.getItem('accessToken')
    const response = await axios.post(
      'http://localhost:3000/api/orders/preview',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Preview response:', response.data)

    if (response.data && response.data.data) {
      // Lưu dữ liệu từ API
      previewData.value = {
        subtotal: response.data.data.subtotal || 0,
        tax: response.data.data.tax || 0,
        shippingFee: response.data.data.shippingFee || 0,
        discount: response.data.data.discount || 0,
        totalAmount: response.data.data.totalAmount || 0
      }
      console.log('Preview data updated:', previewData.value)
      alert('✅ Áp dụng voucher thành công!')
    }
  } catch (error) {
    console.error('Lỗi áp dụng voucher:', error)
    console.error('Error details:', error.response?.data)
    alert('❌ Áp dụng voucher thất bại. Vui lòng kiểm tra lại.')
  } finally {
    isLoading.value = false
  }
}

const confirmAndProceed = async () => {
  if (!selectedAddress.value) {
    alert('Vui lòng chọn địa chỉ giao hàng')
    return
  }

  if (cartItems.value.length === 0) {
    alert('Giỏ hàng trống')
    return
  }

  isLoading.value = true

  try {
    // Chuẩn bị request body theo cấu trúc request.json
    const requestBody = {
      items: cartItems.value.map(item => ({
        productId: item.id,
        sizeId: item.sizeId || 1,
        quantity: item.quantity,
        toppingIds: Array.isArray(item.toppingIds) ? item.toppingIds : [],
        iceOptionId: item.iceOptionId || 1,
        notes: item.notes || ''
      })),
      addressId: selectedAddress.value.id,
      voucherCode: voucherCode.value || '',
      deliveryMethod: deliveryMethod.value
    }

    console.log('Request body:', requestBody)

    // Gọi API preview
    const token = localStorage.getItem('accessToken')
    const response = await axios.post(
      'http://localhost:3000/api/orders/preview',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Preview response:', response.data)

    // Lưu preview data vào state và orderStore
    if (response.data && response.data.data) {
      // Cập nhật previewData state
      previewData.value = {
        subtotal: response.data.data.subtotal || 0,
        tax: response.data.data.tax || 0,
        shippingFee: response.data.data.shippingFee || 0,
        discount: response.data.data.discount || 0,
        totalAmount: response.data.data.totalAmount || 0
      }
      
      // Lưu vào orderStore
      orderStore.setPreviewData(response.data.data)
      orderStore.setSelectedAddress(selectedAddress.value)
      orderStore.setVoucherCode(voucherCode.value)
      orderStore.setDeliveryMethod(deliveryMethod.value)
      
      console.log('Preview data saved:', previewData.value)
    }
    
    // Chuyển sang trang Checkout
    router.push('/checkout')
  } catch (error) {
    console.error('Lỗi preview đơn hàng:', error)
    alert('Không thể xem trước đơn hàng. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('OrderPreview mounted, cartItems:', cartItems.value)
  
  // Kiểm tra giỏ hàng
  if (cartItems.value.length === 0) {
    console.warn('Giỏ hàng trống!')
    alert('Giỏ hàng trống! Chuyển về trang chủ.')
    router.push('/')
    return
  }

  // Load địa chỉ mặc định
  console.log('Loading default address...')
  await loadDefaultAddress()
  console.log('Selected address:', selectedAddress.value)
  
  // Nếu không load được địa chỉ, dùng fallback
  if (!selectedAddress.value) {
    console.warn('No address loaded, using fallback')
    selectedAddress.value = {
      id: 1,
      fullName: 'Khách hàng',
      phone: '0123456789',
      fullAddress: 'Địa chỉ giao hàng',
      district: 'Quận 1',
      city: 'TP.HCM'
    }
  }
})
</script>

<style scoped>
.order-preview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.preview-title {
  color: #333;
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-title i {
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

.preview-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 20px 0;
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

/* Address Section */
.address-display {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ff6b00;
}

.address-info {
  flex: 1;
}

.address-name {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.address-phone {
  margin-left: 10px;
  color: #666;
  font-size: 0.9rem;
}

.address-detail {
  margin: 5px 0;
  color: #555;
}

.address-location {
  margin: 5px 0;
  color: #888;
  font-size: 0.9rem;
}

.address-actions {
  display: flex;
  gap: 10px;
  margin-left: 20px;
}

.btn-change,
.btn-add {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-change {
  background: #ff6b00;
  color: white;
}

.btn-change:hover {
  background: #e55a00;
}

.btn-add {
  background: #e9ecef;
  color: #666;
}

.btn-add:hover:not(:disabled) {
  background: #dee2e6;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.address-item:hover {
  border-color: #ff6b00;
  background: #fff9f5;
}

.address-item.active {
  border-color: #ff6b00;
  background: #fff3e0;
}

.address-radio {
  display: flex;
  align-items: flex-start;
  padding-top: 3px;
}

.address-radio input {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.address-item-info {
  flex: 1;
}

.item-name {
  margin: 0 0 5px 0;
  color: #333;
  font-weight: 600;
}

.item-address {
  margin: 0 0 5px 0;
  color: #555;
  font-size: 0.95rem;
}

.item-location {
  margin: 0;
  color: #888;
  font-size: 0.9rem;
}

.badge-default {
  display: inline-block;
  background: #ff6b00;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 5px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-confirm {
  background: #ff6b00;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-confirm:hover {
  background: #e55a00;
}

/* Products Section */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-bottom: 1px solid #eee;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 8px 0;
  color: #333;
  font-weight: 600;
}

.product-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.option-tag {
  background: white;
  border: 1px solid #dee2e6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #666;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.option-tag i {
  color: #ff6b00;
}

.product-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.qty {
  color: #666;
}

.price {
  font-weight: 600;
  color: #ff6b00;
}

/* Voucher Section */
.voucher-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.voucher-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.voucher-input:focus {
  outline: none;
  border-color: #ff6b00;
}

.btn-apply {
  background: #ff6b00;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-apply:hover {
  background: #e55a00;
}

.voucher-applied {
  color: #28a745;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Delivery Section */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.delivery-option:hover {
  border-color: #ff6b00;
  background: #fff9f5;
}

.delivery-option input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.option-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-label small {
  color: black;
}

/* Summary Section */
.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid black;
  color: black;
}

.summary-row.discount-row {
  color: #28a745;
}

.summary-row.total-row {
  border-top: 2px solid #ff6b00;
  border-bottom: none;
  padding-top: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff6b00;
}

.total-amount {
  color: #ff6b00;
}

/* Actions */
.preview-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.btn-confirm-payment {
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
  transition: all 0.2s;
}

.btn-confirm-payment:hover:not(:disabled) {
  background: #e55a00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

.btn-confirm-payment:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .address-display {
    flex-direction: column;
    gap: 15px;
  }

  .address-actions {
    margin-left: 0;
    width: 100%;
  }

  .btn-change,
  .btn-add {
    flex: 1;
    justify-content: center;
  }

  .product-item {
    flex-direction: column;
  }

  .product-image {
    width: 100%;
    height: 200px;
  }

  .voucher-input-group {
    flex-direction: column;
  }

  .btn-apply {
    width: 100%;
  }
}
</style>
