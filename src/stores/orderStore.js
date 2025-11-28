import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  // State
  const previewData = ref(null)
  const selectedAddress = ref(null)
  const voucherCode = ref('')
  const deliveryMethod = ref('DELIVERY')

  // Actions
  const setPreviewData = (data) => {
    previewData.value = data
  }

  const setSelectedAddress = (address) => {
    selectedAddress.value = address
  }

  const setVoucherCode = (code) => {
    voucherCode.value = code
  }

  const setDeliveryMethod = (method) => {
    deliveryMethod.value = method
  }

  const clearOrderData = () => {
    previewData.value = null
    selectedAddress.value = null
    voucherCode.value = ''
    deliveryMethod.value = 'DELIVERY'
  }

  return {
    previewData,
    selectedAddress,
    voucherCode,
    deliveryMethod,
    setPreviewData,
    setSelectedAddress,
    setVoucherCode,
    setDeliveryMethod,
    clearOrderData
  }
})
