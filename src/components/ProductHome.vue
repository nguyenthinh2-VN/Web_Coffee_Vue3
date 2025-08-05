<template>
  <div class="card product-card" @click="navigateToProduct">
    <div class="product-image-container">
      <img :src="product.hinh" class="card-img-top" :alt="product.tensp" />
      <div v-if="product.badge" class="product-badge">
        {{ product.badge }}
      </div>
    </div>
    <div class="card-body product-info">
      <h3 class="card-title">{{ product.tensp }}</h3>
      <p class="card-text product-price">{{ formatPrice(product.gia) }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price).replace('₫', 'đ');
    };

    const navigateToProduct = () => {
      console.log('Navigating to product:', props.product.id);
      router.push(`/product/${props.product.id}`);
    };

    return {
      formatPrice,
      navigateToProduct
    };
  }
};
</script>

<style scoped>
.product-card {
  width: 100%; /* Keep 100% for responsiveness within the column */
  max-width: 273px; /* Set maximum width for the card */
  margin: 0 auto; /* Center the card within its column */
  height: 100%; /* Ensure card takes full height of grid item */
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex; /* Use flexbox for card content */
  flex-direction: column; /* Stack image and info vertically */
}

.product-card:hover {
  cursor: pointer;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.product-image-container {
  position: relative;
  width: 100%; /* Ensure image container fills the card's width */
  height: 273px; /* Keep fixed height for the image container */
  overflow: hidden;
}

.product-image-container img {
  width: 100%; /* Ensure image fills its container */
  height: 100%; /* Ensure image fills its container */
  object-fit: cover; /* Cover the container */
}

.product-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(45deg, #ff4757, #ff6b7a);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.product-info {
  padding: 12px 16px 16px;
  text-align: left;
  flex-grow: 1; /* Allow info section to grow and fill space */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Push price to bottom if needed */
}

.product-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin: 0;
  font-size: 15px;
  color: #ff6b00;
  font-weight: 550;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-image-container {
    height: 200px; /* Adjust height for smaller screens if needed, or keep 273px */
  }
  
  .product-info h3 {
    font-size: 14px;
  }
  
  .product-price {
    font-size: 14px;
  }
  
  .product-badge {
    font-size: 9px;
    padding: 3px 6px;
  }
}

@media (max-width: 480px) {
  .product-image-container {
    height: 150px; /* Adjust height for even smaller screens if needed, or keep 273px */
  }
  
  .product-info {
    padding: 8px 12px 12px;
  }
  
  .product-info h3 {
    font-size: 13px;
  }
  
  .product-price {
    font-size: 13px;
  }
}
</style>
