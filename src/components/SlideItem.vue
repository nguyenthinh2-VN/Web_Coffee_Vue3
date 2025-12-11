<template>
  <swiper
    :slidesPerView="4"
    :spaceBetween="30"
    :breakpoints="{
      320: { slidesPerView: 2, spaceBetween: 10 },
      768: { slidesPerView: 5, spaceBetween: 20 },
      1024: { slidesPerView: 6, spaceBetween: 25 },
    }"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide v-for="product in products" :key="product.id">
      <div class="slide-product-card" @click="navigateToProduct(product.id)">
        <div class="slide-product-image">
          <img :src="product.hinh" :alt="product.tensp" />
        </div>
        <div class="slide-product-info">
          <h3>{{ product.tensp }}</h3>
          <p>{{ formatPrice(product.gia) }}</p>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { useRouter } from "vue-router";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      })
        .format(price)
        .replace("₫", "đ");
    };

    const navigateToProduct = (productId) => {
      router.push(`/product/${productId}`);
    };

    return {
      modules: [Pagination],
      formatPrice,
      navigateToProduct,
    };
  },
};
</script>


<style scoped>
.mySwiper {
  padding: 10px 5px;
}
.swiper-slide {
  height: 50%;
}

.slide-product-card {
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.slide-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.slide-product-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.slide-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-product-info {
  padding: 8px 10px;
  background: white;
}

.slide-product-info h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
  line-height: 1.4;
}

.slide-product-info p {
  font-size: 14px;
  color: #00000099;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .slide-product-info h3 {
    font-size: 14px;
  }

  .slide-product-info p {
    font-size: 14px;
  }

  .slide-product-info {
    padding: 6px 8px;
  }
}
</style>