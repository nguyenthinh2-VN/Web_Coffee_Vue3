<template>
  <!-- Component đánh giá sao đơn giản - chỉ hiện trung bình -->
  <div class="rating-summary">
    <div class="rating-display" v-if="averageRating > 0">
      <n-rate :value="averageRating" readonly size="medium" />
      <span class="rating-value">{{ averageRating }}</span>
      <span class="rating-count">({{ totalRatings }} đánh giá)</span>
    </div>
    <div v-else class="no-rating">
      <n-rate :value="0" readonly size="medium" />
      <span class="no-rating-text">Chưa có đánh giá</span>
    </div>

    <router-link :to="`/product/${productId}/reviews`" class="view-reviews-btn">
      <span>Xem tất cả đánh giá</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </router-link>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { NRate } from "naive-ui";
import axios from "axios";

export default {
  name: "ProductRating",
  components: {
    NRate,
  },
  props: {
    productId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const averageRating = ref(0);
    const totalRatings = ref(0);

    const GET_REVIEWS_API = "http://localhost:3001/list";

    // Tải và tính đánh giá trung bình
    const loadRatings = async () => {
      try {
        const response = await axios.get(
          `${GET_REVIEWS_API}?productId=${props.productId}`
        );

        const validReviews = response.data.filter(
          (item) => item.rating !== undefined && !item.success
        );

        if (validReviews.length > 0) {
          const sum = validReviews.reduce(
            (total, review) => total + (review.rating || 0),
            0
          );
          averageRating.value =
            Math.round((sum / validReviews.length) * 10) / 10;
          totalRatings.value = validReviews.length;
        } else {
          averageRating.value = 0;
          totalRatings.value = 0;
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
      }
    };

    onMounted(() => {
      if (props.productId) {
        loadRatings();
      }
    });

    watch(
      () => props.productId,
      (newProductId) => {
        if (newProductId) {
          loadRatings();
        }
      }
    );

    return {
      averageRating,
      totalRatings,
    };
  },
};
</script>

<style scoped>
.rating-summary {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-display,
.no-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.rating-value {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b00;
}

.rating-count {
  color: #666;
  font-size: 14px;
}

.no-rating-text {
  color: #999;
  font-size: 14px;
}

.view-reviews-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ff6b00;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.view-reviews-btn:hover {
  color: #ff8533;
  gap: 10px;
}

.view-reviews-btn svg {
  transition: transform 0.2s ease;
}

.view-reviews-btn:hover svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .rating-summary {
    padding: 12px 16px;
  }

  .rating-value {
    font-size: 16px;
  }
}
</style>
