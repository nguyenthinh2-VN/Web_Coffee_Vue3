import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { createPinia } from 'pinia'; // Giữ nguyên từ index.js bạn cung cấp
import Home from '@/components/HomeCompo.vue';
import About from '@/components/AboutCompo.vue';
import MenuProduct from '@/components/menuProduct.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import BlogPage from '@/components/blogPage.vue';
import CartModal from '@/components/CartModal.vue';
import OrderPreview from '@/components/OrderPreview.vue';
import OrderSuccess from '@/components/OrderSuccess.vue';
import PaymentCallback from '@/components/PaymentCallback.vue';
import MyOrders from '@/components/MyOrders.vue';
import OrderDetail from '@/components/OrderDetail.vue';

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
      path: '/intro',
      name: 'Intro',
      component: () => import('@/components/IntroPage.vue')
    },
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
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('@/components/ForgotPassword.vue'),
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
      path: '/product/:id/reviews',
      name: 'ProductReviews',
      component: () => import('@/components/ProductReviews.vue')
    },
    {
        path: '/cart',
        name: 'Cart',
        component: CartModal
      },
    {
      path: '/order-preview',
      name: 'OrderPreview',
      component: OrderPreview,
      // Ghi chú: Route cho trang xem trước đơn hàng - bắt buộc đăng nhập
      meta: { requiresAuth: true }
    },
    {
      path: '/order-success/:orderId?',
      name: 'OrderSuccess',
      component: OrderSuccess,
      // Ghi chú: Route cho trang thành công - bắt buộc đăng nhập
      meta: { requiresAuth: true }
    },
    {
      path: '/payment-callback',
      name: 'PaymentCallback',
      component: PaymentCallback,
      // Ghi chú: Route cho callback từ VNPAY - bắt buộc đăng nhập
      meta: { requiresAuth: true }
    },
    {
      path: '/my-orders',
      name: 'MyOrders',
      component: MyOrders,
      // Ghi chú: Route cho danh sách đơn hàng - bắt buộc đăng nhập
      meta: { requiresAuth: true }
    },
    {
      path: '/order-detail/:orderId',
      name: 'OrderDetail',
      component: OrderDetail,
      // Ghi chú: Route cho chi tiết đơn hàng - bắt buộc đăng nhập
      meta: { requiresAuth: true }
    },
    {
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: () => import('@/components/PaymentSuccess.vue'),
      // Ghi chú: Route cho trang thành công thanh toán - không bắt buộc đăng nhập
      meta: { requiresAuth: false }
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