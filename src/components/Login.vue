<!-- File: src/components/Login.vue -->
<script setup>
/* global google */
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const googleLoading = ref(false);

// Initialize Google Sign-In
onMounted(() => {
  if (window.google) {
    const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Google Client ID not configured. Please set VUE_APP_GOOGLE_CLIENT_ID in .env.local');
      return;
    }
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleLogin
    });
    
    // Render Google Sign-In button
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  } else {
    console.warn('Google Sign-In script not loaded. Make sure it is included in index.html');
  }
});

async function handleLogin() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(username.value, password.value);
    console.log('Redirecting to:', authStore.returnUrl || '/');
    username.value = ''; // Clear inputs on success
    password.value = '';
    router.push(authStore.returnUrl || '/');
  } catch (error) {
    errorMessage.value = error.message;
    console.error('Login error:', error.message);
  } finally {
    isLoading.value = false;
  }
}

async function handleGoogleLogin(response) {
  googleLoading.value = true;
  errorMessage.value = '';
  try {
    const googleIdToken = response.credential;
    await authStore.loginWithGoogle(googleIdToken);
    console.log('Google login successful, redirecting to:', authStore.returnUrl || '/');
    router.push(authStore.returnUrl || '/');
  } catch (error) {
    errorMessage.value = error.message;
    console.error('Google login error:', error.message);
  } finally {
    googleLoading.value = false;
  }
}

</script>

<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Tên đăng nhập:</label>
        <input v-model="username" type="text" required placeholder="Nhập tên đăng nhập..." />
      </div>
      <div class="form-group">
        <label>Mật khẩu:</label>
        <input v-model="password" type="password" required placeholder="Nhập mật khẩu..." />
      </div>
      <div class="forgot-password-link">
        <router-link to="/forgot-password">Quên mật khẩu?</router-link>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>

    <div class="divider">
      <span>Hoặc</span>
    </div>

    <div id="google-signin-button" class="google-button-container"></div>

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

.forgot-password-link {
  text-align: right;
  margin-bottom: 1rem;
  margin-top: -0.5rem;
}

.forgot-password-link a {
  color: #ff6b00;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password-link a:hover {
  text-decoration: underline;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #999;
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #ddd;
}

.divider span {
  padding: 0 0.75rem;
}

.google-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

:deep(.google-button-container button) {
  width: 100% !important;
}
</style>