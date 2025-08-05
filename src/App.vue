
<template>
  <n-message-provider>
    <div class="app">
      <HeaderCompo />
      <main>
        <router-view/>
        <CartModal />
      </main>
      <FooterCompo />
    </div>
  </n-message-provider>
</template>

<script>
import HeaderCompo from '@/components/HeaderCompo.vue'
import FooterCompo from '@/components/FooterCompo.vue'
import CartModal from '@/components/CartModal.vue'
import { NMessageProvider } from 'naive-ui'

export default {
  name: 'App',
  components: {
    HeaderCompo,
    FooterCompo,
    CartModal,
    NMessageProvider
  }
}
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
