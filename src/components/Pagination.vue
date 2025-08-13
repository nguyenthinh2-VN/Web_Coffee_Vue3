<template>
  <nav aria-label="Product pagination">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
          <i class="bi bi-chevron-left"></i>
        </a>
      </li>
      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
          <i class="bi bi-chevron-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useMenuStore } from '../stores/menuStore.js';

export default {
  name: 'Pagination',
  setup() {
    const menuStore = useMenuStore();

    const changePage = (page) => {
      console.log('Pagination: changePage called with page:', page);
      menuStore.setCurrentPage(page);
    };

    return {
      totalPages: computed(() => menuStore.totalPages),
      currentPage: computed(() => menuStore.currentPage),
      changePage
    };
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.page-link {
  color: #007bff;
}

.page-link:hover {
  color: #0056b3;
}
</style>