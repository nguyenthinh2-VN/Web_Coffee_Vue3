<!-- File: src/components/ForgotPassword.vue -->
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// State management
const step = ref(1); // 1: Nhập email, 2: Nhập OTP, 3: Đặt lại mật khẩu
const email = ref('');
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Bước 1: Gửi OTP đến email
async function handleSendOtp() {
  if (!email.value) {
    errorMessage.value = 'Vui lòng nhập địa chỉ email.';
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Địa chỉ email không hợp lệ.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await authStore.sendOtp(email.value);
    successMessage.value = result.message || 'Mã OTP đã được gửi đến email của bạn.';
    step.value = 2; // Chuyển sang bước nhập OTP
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

// Bước 2: Xác minh OTP (tùy chọn - có thể bỏ qua và xác minh trực tiếp ở bước 3)
async function handleVerifyOtp() {
  if (!otp.value) {
    errorMessage.value = 'Vui lòng nhập mã OTP.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await authStore.verifyOtp(email.value, otp.value);
    if (result.success) {
      successMessage.value = result.message || 'Xác minh OTP thành công.';
      step.value = 3; // Chuyển sang bước đặt lại mật khẩu
    } else {
      errorMessage.value = result.message || 'Mã OTP không hợp lệ.';
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

// Bước 3: Đặt lại mật khẩu
async function handleResetPassword() {
  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin mật khẩu.';
    return;
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await authStore.resetPassword(email.value, otp.value, newPassword.value);
    successMessage.value = result.message || 'Đặt lại mật khẩu thành công!';
    
    // Chuyển về trang login sau 2 giây
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

// Quay lại bước trước
function goBack() {
  if (step.value > 1) {
    step.value--;
    errorMessage.value = '';
    successMessage.value = '';
  }
}
</script>

<template>
  <div class="forgot-password-container">
    <h2>Quên mật khẩu</h2>
    
    <!-- Progress indicator -->
    <div class="progress-indicator">
      <div class="progress-step" :class="{ active: step >= 1, completed: step > 1 }">
        <div class="step-number">1</div>
        <div class="step-label">Nhập Email</div>
      </div>
      <div class="progress-line" :class="{ active: step > 1 }"></div>
      <div class="progress-step" :class="{ active: step >= 2, completed: step > 2 }">
        <div class="step-number">2</div>
        <div class="step-label">Xác minh OTP</div>
      </div>
      <div class="progress-line" :class="{ active: step > 2 }"></div>
      <div class="progress-step" :class="{ active: step >= 3 }">
        <div class="step-number">3</div>
        <div class="step-label">Mật khẩu mới</div>
      </div>
    </div>

    <!-- Step 1: Nhập email -->
    <form v-if="step === 1" @submit.prevent="handleSendOtp" class="form-step">
      <p class="step-description">Nhập địa chỉ email của bạn để nhận mã OTP</p>
      <div class="form-group">
        <label>Email:</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          placeholder="Nhập địa chỉ email..." 
          :disabled="isLoading"
        />
      </div>
      <button type="submit" :disabled="isLoading" class="btn-primary">
        {{ isLoading ? 'Đang gửi...' : 'Gửi mã OTP' }}
      </button>
    </form>

    <!-- Step 2: Nhập OTP -->
    <form v-if="step === 2" @submit.prevent="handleVerifyOtp" class="form-step">
      <p class="step-description">Nhập mã OTP đã được gửi đến email: <strong>{{ email }}</strong></p>
      <div class="form-group">
        <label>Mã OTP:</label>
        <input 
          v-model="otp" 
          type="text" 
          required 
          placeholder="Nhập mã OTP (6 chữ số)..." 
          maxlength="6"
          :disabled="isLoading"
        />
      </div>
      <div class="button-group">
        <button type="button" @click="goBack" class="btn-secondary" :disabled="isLoading">
          Quay lại
        </button>
        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? 'Đang xác minh...' : 'Xác minh OTP' }}
        </button>
      </div>
      <p class="resend-link">
        Không nhận được mã? <a @click="handleSendOtp" href="#">Gửi lại</a>
      </p>
    </form>

    <!-- Step 3: Đặt lại mật khẩu -->
    <form v-if="step === 3" @submit.prevent="handleResetPassword" class="form-step">
      <p class="step-description">Tạo mật khẩu mới cho tài khoản của bạn</p>
      <div class="form-group">
        <label>Mật khẩu mới:</label>
        <input 
          v-model="newPassword" 
          type="password" 
          required 
          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..." 
          :disabled="isLoading"
        />
      </div>
      <div class="form-group">
        <label>Xác nhận mật khẩu:</label>
        <input 
          v-model="confirmPassword" 
          type="password" 
          required 
          placeholder="Nhập lại mật khẩu mới..." 
          :disabled="isLoading"
        />
      </div>
      <div class="button-group">
        <button type="button" @click="goBack" class="btn-secondary" :disabled="isLoading">
          Quay lại
        </button>
        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu' }}
        </button>
      </div>
    </form>

    <!-- Messages -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>

    <!-- Back to login link -->
    <p class="back-to-login">
      <router-link to="/login">← Quay lại đăng nhập</router-link>
    </p>
  </div>
</template>

<style scoped>
.forgot-password-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

/* Progress Indicator */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 0 20px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background-color: #ff6b00;
  color: white;
}

.progress-step.completed .step-number {
  background-color: #4caf50;
  color: white;
}

.step-label {
  font-size: 0.85rem;
  color: #999;
  text-align: center;
  transition: color 0.3s ease;
}

.progress-step.active .step-label {
  color: #ff6b00;
  font-weight: 600;
}

.progress-line {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 10px;
  margin-bottom: 30px;
  transition: background-color 0.3s ease;
}

.progress-line.active {
  background-color: #ff6b00;
}

/* Form */
.form-step {
  margin-bottom: 20px;
}

.step-description {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.step-description strong {
  color: #ff6b00;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #ff6b00;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #ff6b00;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #e65c00;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 107, 0, 0.3);
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Messages */
.error {
  color: #f44336;
  margin-top: 15px;
  padding: 12px;
  background-color: #ffebee;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

.success {
  color: #4caf50;
  margin-top: 15px;
  padding: 12px;
  background-color: #e8f5e9;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

/* Links */
.resend-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
}

.resend-link a {
  color: #ff6b00;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.resend-link a:hover {
  text-decoration: underline;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
  font-size: 0.95rem;
}

.back-to-login a {
  color: #ff6b00;
  text-decoration: none;
  font-weight: 600;
}

.back-to-login a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 600px) {
  .forgot-password-container {
    margin: 20px;
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .progress-indicator {
    padding: 0 10px;
  }

  .step-number {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .progress-line {
    margin: 0 5px;
  }

  .button-group {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
