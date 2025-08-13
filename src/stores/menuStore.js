import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './productStore.js'

export const useMenuStore = defineStore('menu', () => {
  // Get product store instance
  const productStore = useProductStore()
  
  // State for filtering, sorting, and pagination
  const selectedCategory = ref(null)
  const searchKeyword = ref('')
  const sortOption = ref('')
  const currentPage = ref(1)
  const pageSize = ref(8)
  
  // Computed properties for filtered and sorted products
  const filteredProducts = computed(() => {
    // Start with all products from the product store
    const products = productStore.products
    
    // Safety check - return empty array if products not loaded yet
    if (!products || !Array.isArray(products)) {
      console.log('Products not loaded yet or invalid:', products)
      return []
    }
    
    let filtered = [...products]
    console.log('Total products available:', filtered.length)
    
    // Filter by search keyword
    if (searchKeyword.value) {
      filtered = filtered.filter(product =>
        product.tensp && product.tensp.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
      console.log('After search filter:', filtered.length, 'products')
    }
    
    // Filter by category if selected
    if (selectedCategory.value) {
      filtered = filtered.filter(product => product.category_id === selectedCategory.value)
      console.log('After category filter:', filtered.length, 'products')
    }
    
    // Sort products based on sort option
    if (sortOption.value) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortOption.value) {
          case 'price-asc':
            return a.gia - b.gia
          case 'price-desc':
            return b.gia - a.gia
          case 'name-asc':
            return a.tensp.localeCompare(b.tensp)
          case 'name-desc':
            return b.tensp.localeCompare(a.tensp)
          default:
            return 0
        }
      })
      console.log('After sorting:', filtered.length, 'products')
    }
    
    console.log('Final filtered products:', filtered.length)
    return filtered
  })
  
  // Computed property for paginated products
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    const paginated = filteredProducts.value.slice(start, end)
    console.log('Paginated products:', paginated.length, 'from', start, 'to', end)
    return paginated
  })
  
  // Computed property for total pages
  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / pageSize.value)
  })
  
  // Actions
  const setSearchKeyword = (keyword) => {
    console.log('Setting search keyword:', keyword)
    searchKeyword.value = keyword
    currentPage.value = 1 // Reset to first page when searching
    console.log('Search keyword set, filtered products:', filteredProducts.value.length)
    
    // Smooth scroll to top when searching (only if keyword is not empty)
    if (keyword.trim()) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
  
  const setSortOption = (option) => {
    console.log('Setting sort option:', option)
    sortOption.value = option
    currentPage.value = 1 // Reset to first page when sorting
    console.log('Sort option set, filtered products:', filteredProducts.value.length)
    
    // Smooth scroll to top when sorting
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  const setCurrentPage = (page) => {
    console.log('Setting current page:', page, 'total pages:', totalPages.value)
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      console.log('Current page set to:', currentPage.value)
      
      // Smooth scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
  
  const setSelectedCategory = (categoryId) => {
    selectedCategory.value = categoryId
    currentPage.value = 1 // Reset to first page when changing category
    
    // Smooth scroll to top when changing category
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  const setPageSize = (size) => {
    pageSize.value = size
    currentPage.value = 1 // Reset to first page when changing page size
  }
  
  // Initialize store - ensure product store is loaded
  const initializeStore = async () => {
    try {
      console.log('Initializing menu store...')
      console.log('Product store before init:', productStore.products?.length || 0, 'products')
      
      // Initialize the product store first to ensure products are loaded
      await productStore.initializeStore()
      
      console.log('Product store after init:', productStore.products?.length || 0, 'products')
      console.log('Menu store initialized successfully')
      
      // Force a reactive update by logging the computed values
      console.log('Filtered products count:', filteredProducts.value.length)
      console.log('Paginated products count:', paginatedProducts.value.length)
      
    } catch (error) {
      console.error('Error initializing menu store:', error)
      throw error
    }
  }
  
  // Reset all filters
  const resetFilters = () => {
    selectedCategory.value = null
    searchKeyword.value = ''
    sortOption.value = ''
    currentPage.value = 1
  }
  
  return {
    // State
    selectedCategory,
    searchKeyword,
    sortOption,
    currentPage,
    pageSize,
    
    // Computed
    filteredProducts,
    paginatedProducts,
    totalPages,
    
    // Actions
    setSearchKeyword,
    setSortOption,
    setCurrentPage,
    setSelectedCategory,
    setPageSize,
    initializeStore,
    resetFilters,
    
    // Access to product store loading states
    loading: computed(() => productStore.productsLoading),
    error: computed(() => productStore.error),
    
    // Access to product store data
    allProducts: computed(() => productStore.products),
    categories: computed(() => productStore.categories)
  }
})
