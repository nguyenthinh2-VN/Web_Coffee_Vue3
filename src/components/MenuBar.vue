<template>
  <div class="menu-bar">
    <!-- Desktop Menu -->
    <n-menu
      v-if="!isMobileView"
      :options="menuOptions"
      :value="currentSelectedKey"
      @update:value="handleUpdateValue"
    />
    
    <!-- Mobile Select -->
    <div v-else class="mobile-select">
      <n-select
        v-model:value="selectedValue"
        :options="selectOptions"
        placeholder="Chọn danh mục"
        @update:value="handleUpdateValue"
      />
    </div>
  </div>
</template>

<script>
import {
  HomeOutline as HomeIcon,
  CafeOutline as CafeIcon,
  LeafOutline as TeaIcon
} from "@vicons/ionicons5";
import { NIcon, useMessage, NSelect } from "naive-ui";
import { defineComponent, h, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from '../stores/productStore.js';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  components: {
    NSelect
  },
  setup(props, { emit }) {
    const message = useMessage();
    const router = useRouter();
    const productStore = useProductStore();
    const selectedValue = ref(null);
    const isMobileView = ref(false);

    // Theo dõi kích thước màn hình
    const checkMobileView = () => {
      isMobileView.value = window.innerWidth <= 768;
    };

    // Menu options cho desktop view
    const menuOptions = ref([
      {
        label: "Trang chủ",
        key: "go-back-home",
        icon: renderIcon(HomeIcon)
      },
      {
        key: "divider-1",
        type: "divider",
        props: {
          style: {
            marginLeft: "32px"
          }
        }
      },
      {
        label: "Tất cả",
        key: "all-products",
        icon: renderIcon(CafeIcon) // Ghi chú: Sử dụng icon phù hợp cho "Tất cả sản phẩm"
      }
    ]);

    // Computed property to get current selected menu key
    const currentSelectedKey = computed(() => {
      if (productStore.selectedCategory) {
        return `category-${productStore.selectedCategory}`;
      }
      // Ghi chú: Kiểm tra nếu đang hiển thị tất cả sản phẩm (không lọc danh mục)
      if (productStore.selectedCategory === null && router.currentRoute.value.path === '/menu') {
        return 'all-products';
      }
      return null;
    });

    // Select options cho mobile view
    const selectOptions = computed(() => {
      const options = [
        {
          label: "Trang chủ",
          value: "go-back-home"
        },
        {
          label: "Tất cả",
          value: "all-products" // Ghi chú: Tùy chọn hiển thị tất cả sản phẩm
        }
      ];

      return options.concat(
        productStore.categories.map(category => ({
          label: category.name,
          value: `category-${category.id}`
        }))
      );
    });

    const initializeMenuBar = async () => {
      try {
        // Use the optimized store initialization
        await productStore.initializeStore();
        generateMenuOptions();
      } catch (error) {
        console.error('Error initializing MenuBar:', error);
        message.error('Không thể tải danh mục sản phẩm');
      }
    };

    const generateMenuOptions = () => {
      const categoryOptions = productStore.categories.map(category => ({
        label: category.name,
        key: `category-${category.id}`,
        icon: renderIcon(category.id === 1 ? CafeIcon : TeaIcon)
      }));

      menuOptions.value = [
        ...menuOptions.value.slice(0, 3), // Include "Tất cả" option
        ...categoryOptions
      ];
    };

    const handleUpdateValue = (key) => {
      selectedValue.value = key;
      if (key === 'go-back-home') {
        // Reset category filter and go to home
        productStore.setSelectedCategory(null);
        router.push('/');
      } else if (key === 'all-products') {
        // Ghi chú: Hiển thị tất cả sản phẩm (xóa bộ lọc danh mục)
        console.log('Selected: Show all products');
        
        // Clear category filter to show all products
        productStore.setSelectedCategory(null);
        
        // Emit event with null to show all products
        emit('category-selected', null);
        
        // Navigate to menu page if not already there
        if (router.currentRoute.value.path !== '/menu') {
          router.push('/menu');
        }
      } else if (key && key.startsWith('category-')) {
        const categoryId = parseInt(key.split('-')[1]);
        console.log('Selected category ID:', categoryId);
        
        // Set the selected category in the store to filter products
        productStore.setSelectedCategory(categoryId);
        
        // Also emit the event for any parent components that might need it
        emit('category-selected', categoryId);
        
        // Navigate to menu page if not already there
        if (router.currentRoute.value.path !== '/menu') {
          router.push('/menu');
        }
      }
    };

    onMounted(() => {
      initializeMenuBar();
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
    });

    return {
      menuOptions,
      selectOptions,
      selectedValue,
      isMobileView,
      handleUpdateValue,
      currentSelectedKey,
      // Store state
      categories: productStore.categories,
      selectedCategory: productStore.selectedCategory,
      categoriesLoading: productStore.categoriesLoading
    };
  }
});
</script>

<style scoped>
.menu-bar {
  width: 250px;
  padding: 20px;
  background-color: #fff;
  border-right: 1px solid #eee;
  min-height: calc(100vh - 80px);
  position: fixed;
  top: 80px;
  left: 0;
}

/* Mobile styles */
@media (max-width: 768px) {
  .menu-bar {
    width: 100%;
    padding: 10px 20px;
    position: static;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .mobile-select {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>