<template>
  <div class="sort-container">
    <div class="dropdown">
      <button
        class="btn btn-outline-secondary sort-btn dropdown-toggle"
        type="button"
        id="sortDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Sắp xếp"
      >
        <i class="bi bi-sort-down-alt"></i>
      </button>
      <ul class="dropdown-menu" aria-labelledby="sortDropdown">
        <li>
          <a class="dropdown-item" href="#" @click.prevent="selectSort('price-asc')">Giá tăng dần</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="selectSort('price-desc')">Giá giảm dần</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="selectSort('name-asc')">Tên A-Z</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="selectSort('name-desc')">Tên Z-A</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useMenuStore } from '../stores/menuStore.js';

export default {
  name: 'SortBar',
  setup() {
    const menuStore = useMenuStore();

    // Handle sort selection
    const selectSort = (option) => {
      console.log('SortBar: selectSort called with option:', option);
      menuStore.setSortOption(option);
    };

    return {
      selectSort,
      sortOption: computed(() => menuStore.sortOption)
    };
  }
};
</script>

<style scoped>
.sort-container {
  display: flex;
  align-items: center;
}

.sort-btn {
  height: 38px;
  width: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.sort-btn:hover {
  background-color: #007bff;
  border-color: #007bff;
}

.dropdown-menu {
  min-width: 150px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .sort-container {
    justify-content: center;
  }
}
</style>