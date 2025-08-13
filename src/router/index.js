import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { createPinia } from 'pinia'; // Giữ nguyên từ index.js bạn cung cấp
import Home from '@/components/HomeCompo.vue';
import About from '@/components/AboutCompo.vue';
import MenuProduct from '@/components/menuProduct.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import BlogPage from '@/components/blogPage.vue';
import CartModal from '@/components/CartModal.vue';
import Checkout from '@/components/Checkout.vue';

export const pinia = createPinia(); // Xuất pinia để sử dụng trong main.js

const router = createRouter({
  history: createWebHistory(),
  // Ghi chú: Cuộn lên đầu trang khi chuyển route để cải thiện UX
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (back/forward navigation), use it
    if (savedPosition) {
      return savedPosition;
    }
    // Otherwise, scroll to top
    return { top: 0, behavior: 'smooth' };
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/Register.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/blog',
      name: 'Blog',
      component: BlogPage
    },
    {
      path: '/menu',
      name: 'MenuProduct',
      component: MenuProduct
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: ProductDetail
    },
    {
        path: '/cart',
        name: 'Cart',
        component: CartModal
      },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout,
      // Ghi chú: Route cho trang thanh toán - bắt buộc đăng nhập
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  console.log('Navigating to:', to.path, 'isLoggedIn:', authStore.isLoggedIn);
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    authStore.returnUrl = to.fullPath;
    return next('/login');
  }
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return next('/');
  }
  next();
});

export default router;