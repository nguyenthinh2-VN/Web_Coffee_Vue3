import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { getApiUrl, API_ENDPOINTS } from '../api.js'

export const useProductStore = defineStore('product', () => {
  // State - Separate loading states for better performance
  const products = ref([])
  const categories = ref([])
  const currentProduct = ref(null)
  const sizes = ref([])
  const relatedProducts = ref([])
  const toppings = ref([]) // Ghi chú: Lưu trữ dữ liệu topping
  const iceOptions = ref([]) // Ghi chú: Lưu trữ dữ liệu tùy chọn đá
  const pagination = ref(null) // Ghi chú: Lưu trữ thông tin phân trang
  
  // Separate loading states
  const productsLoading = ref(false)
  const categoriesLoading = ref(false)
  const currentProductLoading = ref(false)
  const sizesLoading = ref(false)
  const toppingsLoading = ref(false)
  const iceOptionsLoading = ref(false)
  
  const error = ref(null)
  const selectedCategory = ref(null)

  // Getters
  const filteredProducts = computed(() => {
    if (!selectedCategory.value) {
      console.log('No category selected, showing all products:', products.value.length)
      return products.value
    }
    
    const filtered = products.value.filter(product => product.category_id === selectedCategory.value)
    console.log(`Filtered products for category ${selectedCategory.value}:`, filtered.length, 'items')
    console.log('Filtered products:', filtered.map(p => ({ id: p.id, name: p.tensp, price: p.gia, category_id: p.category_id })))
    return filtered
  })

  const getProductById = computed(() => {
    return (id) => products.value.find(product => product.id === parseInt(id))
  })

  // Actions
  const fetchCategories = async () => {
    // Don't fetch if already loaded
    if (categories.value.length > 0) {
      console.log('Categories already loaded:', categories.value)
      return categories.value
    }
    
    try {
      categoriesLoading.value = true
      error.value = null
      const response = await axios.get(getApiUrl(API_ENDPOINTS.CATEGORIES))
      // Xử lý cấu trúc response: có thể là response.data hoặc response.data.data
      categories.value = response.data.data || response.data
      console.log('Fetched categories:', categories.value)
      return categories.value
    } catch (err) {
      error.value = 'Không thể tải danh mục sản phẩm. Vui lòng thử lại.'
      console.error('Error fetching categories:', err)
      throw err
    } finally {
      categoriesLoading.value = false
    }
  }

  const fetchProducts = async () => {
    // Don't fetch if already loaded
    if (products.value.length > 0) {
      return products.value
    }
    
    try {
      productsLoading.value = true
      error.value = null
      const response = await axios.get(getApiUrl(API_ENDPOINTS.PRODUCTS))
      
      // Xử lý cấu trúc response có nested data
      if (response.data.data && response.data.data.data) {
        // Cấu trúc: { success, message, data: { data: [...], pagination: {...} } }
        products.value = response.data.data.data
        pagination.value = response.data.data.pagination
      } else if (response.data.data) {
        // Cấu trúc: { data: [...] }
        products.value = response.data.data
      } else {
        // Cấu trúc: [...]
        products.value = response.data
      }
      
      console.log('Fetched products:', products.value.length, 'items')
      if (pagination.value) {
        console.log('Pagination:', pagination.value)
      }
      return products.value
    } catch (err) {
      error.value = 'Không thể tải sản phẩm. Vui lòng thử lại.'
      console.error('Error fetching products:', err)
      throw err
    } finally {
      productsLoading.value = false
    }
  }

  const fetchSizes = async () => {
    // Don't fetch if already loaded
    if (sizes.value.length > 0) {
      console.log('Sizes already loaded:', sizes.value)
      return sizes.value
    }
    
    try {
      sizesLoading.value = true
      error.value = null
      const response = await axios.get(getApiUrl(API_ENDPOINTS.SIZES))
      // Xử lý cấu trúc response: có thể là response.data hoặc response.data.data
      sizes.value = response.data.data || response.data
      console.log('Fetched sizes:', sizes.value)
      return sizes.value
    } catch (err) {
      error.value = 'Không thể tải kích thước. Vui lòng thử lại.'
      console.error('Error fetching sizes:', err)
      throw err
    } finally {
      sizesLoading.value = false
    }
  }

  const fetchToppings = async () => {
    // Don't fetch if already loaded
    if (toppings.value.length > 0) {
      console.log('Toppings already loaded:', toppings.value)
      return toppings.value
    }
    
    try {
      toppingsLoading.value = true
      error.value = null
      const response = await axios.get(getApiUrl(API_ENDPOINTS.TOPPINGS)) // Ghi chú: Lấy dữ liệu topping từ API
      // Xử lý cấu trúc response: có thể là response.data hoặc response.data.data
      toppings.value = response.data.data || response.data
      console.log('Fetched toppings:', toppings.value)
      return toppings.value
    } catch (err) {
      error.value = 'Không thể tải toppings. Vui lòng thử lại.'
      console.error('Error fetching toppings:', err)
      throw err
    } finally {
      toppingsLoading.value = false
    }
  }

  const fetchIceOptions = async () => {
    // Don't fetch if already loaded
    if (iceOptions.value.length > 0) {
      console.log('Ice options already loaded:', iceOptions.value)
      return iceOptions.value
    }
    
    try {
      iceOptionsLoading.value = true
      error.value = null
      const response = await axios.get(getApiUrl(API_ENDPOINTS.ICE_OPTIONS)) // Ghi chú: Lấy dữ liệu tùy chọn đá từ API
      // Xử lý cấu trúc response: có thể là response.data hoặc response.data.data
      iceOptions.value = response.data.data || response.data
      console.log('Fetched ice options:', iceOptions.value)
      return iceOptions.value
    } catch (err) {
      error.value = 'Không thể tải ice options. Vui lòng thử lại.'
      console.error('Error fetching ice options:', err)
      throw err
    } finally {
      iceOptionsLoading.value = false
    }
  }

  const fetchProductById = async (productId) => {
    try {
      currentProductLoading.value = true
      error.value = null
      
      console.log('Fetching product with ID:', productId)
      
      if (!productId) {
        throw new Error('No product ID provided')
      }

      // Check if product already exists in products array first
      const existingProduct = products.value.find(p => p.id === parseInt(productId))
      if (existingProduct) {
        currentProduct.value = existingProduct
        console.log('Product found in cache:', currentProduct.value)
        return currentProduct.value
      }

      // Fetch product details from API
      const productResponse = await axios.get(getApiUrl(API_ENDPOINTS.PRODUCTS) + '/' + productId)
      currentProduct.value = productResponse.data
      console.log('Product data from API:', currentProduct.value)

      if (!currentProduct.value) {
        throw new Error('Product not found')
      }

      return currentProduct.value
    } catch (err) {
      error.value = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại.'
      console.error('Error fetching product details:', err)
      throw err
    } finally {
      currentProductLoading.value = false
    }
  }



  const fetchRelatedProducts = async (categoryId) => {
    try {
      if (!categoryId) return []
      
      const relatedResponse = await axios.get(
        getApiUrl(API_ENDPOINTS.PRODUCTS) + '?category_id=' + categoryId + '&limit=8'
      )
      
      // Xử lý cấu trúc response có nested data
      if (relatedResponse.data.data && relatedResponse.data.data.data) {
        relatedProducts.value = relatedResponse.data.data.data
      } else if (relatedResponse.data.data) {
        relatedProducts.value = relatedResponse.data.data
      } else {
        relatedProducts.value = relatedResponse.data
      }
      
      console.log('Related products:', relatedProducts.value)
      return relatedProducts.value
    } catch (err) {
      console.error('Error fetching related products:', err)
      return []
    }
  }

  const setSelectedCategory = (categoryId) => {
    selectedCategory.value = categoryId
  }

  const clearCurrentProduct = () => {
    currentProduct.value = null
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize function to load all necessary data
  const initializeStore = async () => {
    try {
      // Load categories, products, sizes, toppings, and ice options in parallel for better performance
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchSizes(),
        fetchToppings(), // Ghi chú: Tải dữ liệu topping
        fetchIceOptions() // Ghi chú: Tải dữ liệu tùy chọn đá
      ])
      console.log('Store initialized successfully')
    } catch (error) {
      console.error('Error initializing store:', error)
    }
  }

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price).replace('₫', 'đ')
  }

  return {
    // State
    products,
    categories,
    currentProduct,
    sizes,
    relatedProducts,
    toppings, // Ghi chú: Expose state topping
    iceOptions, // Ghi chú: Expose state tùy chọn đá
    pagination, // Ghi chú: Expose state phân trang
    error,
    selectedCategory,
    
    // Loading states
    productsLoading,
    categoriesLoading,
    currentProductLoading,
    sizesLoading,
    toppingsLoading,
    iceOptionsLoading,
    
    // Getters
    filteredProducts,
    getProductById,
    
    // Actions
    fetchCategories,
    fetchProducts,
    fetchProductById,
    fetchSizes,
    fetchToppings, // Ghi chú: Expose action lấy dữ liệu topping
    fetchIceOptions, // Ghi chú: Expose action lấy dữ liệu tùy chọn đá
    fetchRelatedProducts,
    setSelectedCategory,
    clearCurrentProduct,
    clearError,
    initializeStore,
    
    // Utilities
    formatPrice
  }
})