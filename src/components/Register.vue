<!-- File: src/components/Register.vue -->
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const errorMessage = ref('');
const isLoading = ref(false);

async function handleRegister() {
  console.log('handleRegister called with:', form.value);
  if (!form.value.username || !form.value.email || !form.value.password || !form.value.confirmPassword) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin.';
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Mật khẩu không khớp.';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
    });
    console.log('Registration successful, redirecting to /login');
    form.value = { username: '', email: '', password: '', confirmPassword: '' }; // Clear inputs
    router.push('/login');
  } catch (error) {
    errorMessage.value = error.message;
    console.error('Registration error:', error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="register-container">
    <h2>Đăng ký</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Tên đăng nhập:</label>
        <input v-model="form.username" type="text" required placeholder="Nhập tên đăng nhập..." />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="form.email" type="email" required placeholder="Nhập email..." />
      </div>
      <div class="form-group">
        <label>Mật khẩu:</label>
        <input v-model="form.password" type="password" required placeholder="Nhập mật khẩu..." />
      </div>
      <div class="form-group">
        <label>Xác nhận mật khẩu:</label>
        <input v-model="form.confirmPassword" type="password" required placeholder="Xác nhận mật khẩu..." />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <p>Đã có tài khoản? <router-link to="/login">Đăng nhập ngay</router-link></p>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #e65c00;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>