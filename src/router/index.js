import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/HomeCompo.vue';
import About from '@/components/AboutCompo.vue';
import MenuProduct from '@/components/menuProduct.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import BlogPage from '@/components/blogPage.vue';

const routes = [
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
