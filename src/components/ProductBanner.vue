<template>
  <div class="product-banner">
    <img 
      src="https://file.hstatic.net/1000075078/file/banner_app_9e1a5d8a8cf8475f903fbc02e631fdf9.jpg" 
      alt="Mê A-Mê Banner"
      class="banner-image"
    >
    
  </div>
</template>

<style scoped>
.product-banner {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.product-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .product-banner {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .product-banner {
    min-height: 150px;
  }
}

@media (max-width: 480px) {
  .product-banner {
    min-height: 120px;
  }
}
</style>