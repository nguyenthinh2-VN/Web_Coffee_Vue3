<!-- File: src/components/Login.vue -->
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Vui lòng điền đầy đủ email và mật khẩu.';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
    console.log('Redirecting to:', authStore.returnUrl || '/');
    email.value = ''; // Clear inputs on success
    password.value = '';
    router.push(authStore.returnUrl || '/');
  } catch (error) {
    errorMessage.value = error.message;
    console.error('Login error:', error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email:</label>
        <input v-model="email" type="email" required placeholder="Nhập email..." />
      </div>
      <div class="form-group">
        <label>Mật khẩu:</label>
        <input v-model="password" type="password" required placeholder="Nhập mật khẩu..." />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <p>Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
  </div>
</template>

<style scoped>
.login-container {
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