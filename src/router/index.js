import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/HomeCompo.vue';
import About from '@/components/AboutCompo.vue';
import MenuProduct from '@/components/menuProduct.vue'; // Import the new component

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
    path: '/menu', // Or whatever path you prefer
    name: 'MenuProduct',
    component: MenuProduct
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
