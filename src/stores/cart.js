
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // Giỏ hàng
  const isOpen = ref(false) // Hiển thị modal

  const addToCart = (product) => {
    const index = items.value.findIndex(
      i => i.id === product.id && i.size === product.size
    )
    if (index !== -1) {
      items.value[index].quantity += product.quantity || 1
    } else {
      items.value.push({ ...product, quantity: product.quantity || 1 })
    }
  }

  const removeFromCart = (index) => {
    items.value.splice(index, 1)
  }

  const clearCart = () => {
    items.value.splice(0, items.value.length)
  }

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  return {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice
  }
})
