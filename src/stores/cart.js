
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // Giỏ hàng
  const isOpen = ref(false) // Hiển thị modal

  const addToCart = (product) => {
    // Ghi chú: Logic giỏ hàng nâng cao để xử lý đầy đủ các tùy chọn sản phẩm
    // Create unique key based on product + all selected options
    const productKey = `${product.id}-${product.size || 'default'}-${(product.toppings || []).sort().join(',')}-${product.ice || 'default'}`;
    
    const index = items.value.findIndex(item => {
      const itemKey = `${item.id}-${item.size || 'default'}-${(item.toppings || []).sort().join(',')}-${item.ice || 'default'}`;
      return itemKey === productKey;
    });
    
    if (index !== -1) {
      // Same product with same options exists, increase quantity
      items.value[index].quantity += product.quantity || 1;
    } else {
      // New product or different options, add as new item
      items.value.push({ 
        ...product, 
        quantity: product.quantity || 1,
        addedAt: new Date().toISOString() // Ghi chú: Theo dõi thời gian thêm sản phẩm
      });
    }
    
    console.log('Added to cart:', product);
    console.log('Current cart items:', items.value.length);
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
