<template>
  <div class="reviews-page">
    <!-- Header -->
    <div class="reviews-header">
      <router-link :to="`/product/${productId}`" class="back-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Quay lại sản phẩm
      </router-link>

      <div class="product-info" v-if="product">
        <img :src="product.hinh" :alt="product.tensp" class="product-thumb" />
        <div class="product-details">
          <h1>Đánh giá: {{ product.tensp }}</h1>
          <div class="rating-summary">
            <n-rate :value="averageRating" readonly />
            <span class="rating-value">{{ averageRating }}</span>
            <span class="rating-count">({{ reviews.length }} đánh giá)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Form gửi đánh giá -->
    <div class="review-form-section" v-if="authStore.isLoggedIn">
      <h2>Viết đánh giá của bạn</h2>
      <div class="review-form">
        <div class="form-row">
          <label>Đánh giá:</label>
          <n-rate v-model:value="userRating" size="large" />
          <span class="rating-text" v-if="userRating > 0"
            >{{ userRating }} sao</span
          >
        </div>

        <div class="form-row">
          <label>Nhận xét:</label>
          <textarea
            v-model="userComment"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            rows="4"
            class="comment-input"
          ></textarea>
        </div>

        <button
          class="submit-btn"
          @click="submitReview"
          :disabled="userRating === 0 || isSubmitting"
        >
          <span v-if="isSubmitting">Đang gửi...</span>
          <span v-else>Gửi đánh giá</span>
        </button>
      </div>
    </div>

    <div v-else class="login-prompt">
      <p>
        Vui lòng <router-link to="/login">đăng nhập</router-link> để gửi đánh
        giá
      </p>
    </div>

    <!-- Danh sách đánh giá -->
    <div class="reviews-list-section">
      <h2>Tất cả đánh giá ({{ reviews.length }})</h2>

      <div v-if="reviews.length === 0" class="no-reviews">
        <div class="empty-icon">💬</div>
        <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      </div>

      <div class="reviews-list">
        <div class="review-card" v-for="review in reviews" :key="review.id">
          <div class="review-avatar">
            <div class="avatar-circle">
              {{ getInitials(review.username) }}
            </div>
          </div>

          <div class="review-content">
            <div class="review-header">
              <span class="username">{{ review.username || "Ẩn danh" }}</span>
              <n-rate :value="review.rating" readonly size="small" />
              <span class="review-date">{{
                formatDate(review.createdAt)
              }}</span>
            </div>

            <p class="review-text">{{ review.comment }}</p>

            <div class="review-reply" v-if="review.reply">
              <div class="reply-header">
                <span class="reply-icon">↪</span>
                <span class="reply-label">Phản hồi từ cửa hàng:</span>
              </div>
              <p class="reply-text">{{ review.reply }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { NRate } from "naive-ui";
import { useAuthStore } from "../stores/authStore.js";
import { useProductStore } from "../stores/productStore.js";
import axios from "axios";

export default {
  name: "ProductReviews",
  components: {
    NRate,
  },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const productStore = useProductStore();

    const productId = computed(() => route.params.id);
    const product = computed(() => productStore.currentProduct);

    const reviews = ref([]);
    const userRating = ref(0);
    const userComment = ref("");
    const isSubmitting = ref(false);

    const POST_REVIEW_API = "http://localhost:3001/previews";
    const GET_REVIEWS_API = "http://localhost:3001/list";

    // Tính đánh giá trung bình
    const averageRating = computed(() => {
      if (reviews.value.length === 0) return 0;
      const sum = reviews.value.reduce(
        (total, r) => total + (r.rating || 0),
        0
      );
      return Math.round((sum / reviews.value.length) * 10) / 10;
    });

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Lấy chữ cái đầu của username
    const getInitials = (username) => {
      if (!username) return "?";
      return username.charAt(0).toUpperCase();
    };

    // Load product
    const loadProduct = async () => {
      if (productId.value) {
        await productStore.fetchProductById(productId.value);
      }
    };

    // Load reviews
    const loadReviews = async () => {
      try {
        const response = await axios.get(
          `${GET_REVIEWS_API}?productId=${productId.value}`
        );
        reviews.value = response.data.filter(
          (item) => item.rating !== undefined && !item.success
        );
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };

    // Submit review
    const submitReview = async () => {
      if (!authStore.isLoggedIn) {
        alert("Vui lòng đăng nhập để đánh giá!");
        return;
      }

      if (userRating.value === 0) {
        alert("Vui lòng chọn số sao!");
        return;
      }

      isSubmitting.value = true;

      try {
        const reviewData = {
          productId: parseInt(productId.value),
          rating: userRating.value,
          comment: userComment.value || "",
        };

        await axios.post(POST_REVIEW_API, reviewData);

        alert("✅ Đã gửi đánh giá thành công!");

        userRating.value = 0;
        userComment.value = "";

        await loadReviews();
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      loadProduct();
      loadReviews();
    });

    watch(productId, () => {
      loadProduct();
      loadReviews();
    });

    return {
      productId,
      product,
      reviews,
      averageRating,
      userRating,
      userComment,
      isSubmitting,
      authStore,
      formatDate,
      getInitials,
      submitReview,
    };
  },
};
</script>

<style scoped>
.reviews-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 100px 20px 60px;
}

/* Header */
.reviews-header {
  margin-bottom: 32px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #ff6b00;
}

.product-info {
  display: flex;
  gap: 20px;
  align-items: center;
  background: linear-gradient(145deg, #fff, #f8f9fa);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.product-thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.product-details h1 {
  font-size: 22px;
  color: #333;
  margin: 0 0 8px;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 10px;
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

/* Review Form */
.review-form-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #ff6b00;
}

.review-form-section h2 {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row label {
  font-weight: 500;
  color: #333;
}

.rating-text {
  color: #ff6b00;
  font-weight: 600;
  font-size: 14px;
}

.comment-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  background: #fafafa;
}

.comment-input:focus {
  outline: none;
  border-color: #ff6b00;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #ff6b00, #ff9500);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
  align-self: flex-start;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.login-prompt {
  background: #e3f2fd;
  border: 2px solid #2196f3;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  text-align: center;
}

.login-prompt a {
  color: #1976d2;
  font-weight: 600;
}

/* Reviews List */
.reviews-list-section h2 {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px;
}

.no-reviews {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 16px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-reviews p {
  color: #666;
  font-size: 16px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.review-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.review-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00, #ff9500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.review-content {
  flex: 1;
  min-width: 0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.review-date {
  color: #999;
  font-size: 12px;
  margin-left: auto;
}

.review-text {
  color: #444;
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
}

.review-reply {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(145deg, #f0f7ff, #e8f4fd);
  border-radius: 12px;
  border-left: 4px solid #2196f3;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.reply-icon {
  color: #2196f3;
  font-weight: bold;
}

.reply-label {
  font-weight: 600;
  color: #1976d2;
  font-size: 13px;
}

.reply-text {
  color: #444;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .reviews-page {
    padding: 80px 16px 40px;
  }

  .product-info {
    flex-direction: column;
    text-align: center;
  }

  .product-details h1 {
    font-size: 18px;
  }

  .rating-summary {
    justify-content: center;
    flex-wrap: wrap;
  }

  .review-form-section {
    padding: 20px;
  }

  .submit-btn {
    width: 100%;
  }

  .review-card {
    flex-direction: column;
  }

  .review-avatar {
    align-self: flex-start;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .review-date {
    margin-left: 0;
  }
}
</style>
