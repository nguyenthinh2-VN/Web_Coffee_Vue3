<template>
  <div class="menu-bar">
    <!-- Desktop Menu -->
    <n-menu
      v-if="!isMobileView"
      :options="menuOptions"
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
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from './../api.js';

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
    const categories = ref([]);
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
      }
    ]);

    // Select options cho mobile view
    const selectOptions = computed(() => {
      const options = [
        {
          label: "Trang chủ",
          value: "go-back-home"
        }
      ];

      return options.concat(
        categories.value.map(category => ({
          label: category.tendm,
          value: `category-${category.id}`
        }))
      );
    });

    const fetchCategories = async () => {
      try {
        const response = await axios.get(getApiUrl(API_ENDPOINTS.CATEGORIES));
        categories.value = response.data;
        generateMenuOptions();
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Không thể tải danh mục sản phẩm');
      }
    };

    const generateMenuOptions = () => {
      const categoryOptions = categories.value.map(category => ({
        label: category.tendm,
        key: `category-${category.id}`,
        icon: renderIcon(category.id === 1 ? CafeIcon : TeaIcon)
      }));

      menuOptions.value = [
        ...menuOptions.value.slice(0, 2),
        ...categoryOptions
      ];
    };

    const handleUpdateValue = (key) => {
      selectedValue.value = key;
      if (key === 'go-back-home') {
        router.push('/');
      } else if (key && key.startsWith('category-')) {
        const categoryId = parseInt(key.split('-')[1]);
        emit('category-selected', categoryId);
      }
    };

    onMounted(() => {
      fetchCategories();
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
    });

    return {
      menuOptions,
      selectOptions,
      selectedValue,
      isMobileView,
      handleUpdateValue
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