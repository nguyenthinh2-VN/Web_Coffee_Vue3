import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'primeicons/primeicons.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import naive from "naive-ui";
import Button from 'primevue/button'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
import { setupAxiosInterceptors } from './utils/axiosInterceptor'

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)

// Setup axios interceptors sau khi pinia đã được khởi tạo
setupAxiosInterceptors()
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false
        }
    }
})
app.use(naive);
app.component('Button', Button)

app.mount('#app')