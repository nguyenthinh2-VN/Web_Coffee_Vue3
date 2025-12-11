
<template>
  <n-message-provider>
    <div class="app">
      <HeaderCompo v-if="!isIntroPage" />
      <main>
        <router-view />
        <CartModal />
      </main>
      <FooterCompo v-if="!isIntroPage" />
    </div>
  </n-message-provider>
</template>

<script>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import HeaderCompo from "@/components/HeaderCompo.vue";
import FooterCompo from "@/components/FooterCompo.vue";
import CartModal from "@/components/CartModal.vue";
import { NMessageProvider } from "naive-ui";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "App",
  components: {
    HeaderCompo,
    FooterCompo,
    CartModal,
    NMessageProvider,
  },
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();

    // Check if current route is intro page
    const isIntroPage = computed(() => route.name === "Intro");

    // Khởi tạo auth state từ localStorage khi app load
    onMounted(() => {
      authStore.initializeAuth();
    });

    return {
      isIntroPage,
    };
  },
};
</script>

<style>
body {
  background-color: #fff; /* Set global background to white */
  margin: 0; /* Remove default body margin */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff; /* Ensure app background is white */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

main {
  flex: 1; /* Allow main content to grow and fill available space */
}
</style>
