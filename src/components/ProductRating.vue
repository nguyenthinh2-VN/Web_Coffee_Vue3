<template>
  <!-- Ghi chú: Component đánh giá sao sử dụng Naive UI n-rate -->
  <div class="rating-section">
    <h3>Đánh giá sản phẩm</h3>
    <div class="rating-container">
      <div class="current-rating" v-if="averageRating > 0">
        <span class="rating-text">Đánh giá trung bình: </span>
        <n-rate :value="averageRating" readonly />
        <span class="rating-count">({{ totalRatings }} đánh giá)</span>
      </div>
      <div v-else class="no-rating">
        <span class="rating-text">Chưa có đánh giá nào</span>
      </div>
      
      <div class="user-rating" v-if="authStore.isLoggedIn">
        <span class="rating-text">Đánh giá của bạn: </span>
        <n-rate v-model:value="userRating" @update:value="handleRatingChange" />
        <span class="rating-note" v-if="userRating > 0">({{ userRating }} sao)</span>
      </div>
      <div v-else class="login-prompt">
        <span class="rating-text">Đăng nhập để đánh giá sản phẩm</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { NRate } from 'naive-ui';
import { useAuthStore } from '../stores/authStore.js';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../api.js';

export default {
  name: 'ProductRating',
  components: {
    NRate
  },
  props: {
    productId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const authStore = useAuthStore();
    
    // Ghi chú: Biến cho chức năng đánh giá sao
    const userRating = ref(0);
    const averageRating = ref(0);
    const totalRatings = ref(0);
    const ratings = ref([]);

    // Ghi chú: Các hàm xử lý đánh giá sao
    const loadRatings = async () => {
      try {
        const response = await axios.get(`${getApiUrl(API_ENDPOINTS.RATINGS)}?productId=${props.productId}`);
        ratings.value = response.data;
        
        // Tính toán đánh giá trung bình
        if (ratings.value.length > 0) {
          const sum = ratings.value.reduce((total, rating) => total + rating.rating, 0);
          averageRating.value = Math.round((sum / ratings.value.length) * 10) / 10;
          totalRatings.value = ratings.value.length;
        } else {
          averageRating.value = 0;
          totalRatings.value = 0;
        }
        
        // Tìm đánh giá của người dùng hiện tại
        if (authStore.isLoggedIn) {
          const userExistingRating = ratings.value.find(rating => rating.userEmail === authStore.userEmail);
          if (userExistingRating) {
            userRating.value = userExistingRating.rating;
          } else {
            userRating.value = 0;
          }
        }
      } catch (error) {
        console.error('Error loading ratings:', error);
      }
    };

    //Kiểm tra đăng nhập trước khi đánh giá
    const handleRatingChange = async (newRating) => {
      if (!authStore.isLoggedIn) {
        alert('Vui lòng đăng nhập để đánh giá sản phẩm!');
        return;
      }

      try {
        const existingRating = ratings.value.find(rating => rating.userEmail === authStore.userEmail);
        
        const ratingData = {
          productId: parseInt(props.productId),
          userId: Math.floor(Math.random() * 1000000), // Tạm thời sử dụng random ID
          userEmail: authStore.userEmail,
          userName: authStore.userName,
          rating: newRating,
          createdAt: new Date().toISOString()
        };

        if (existingRating) {
          // Cập nhật đánh giá hiện có
          await axios.put(`${getApiUrl(API_ENDPOINTS.RATINGS)}/${existingRating.id}`, ratingData);
          console.log('Đã cập nhật đánh giá:', newRating, 'sao');
        } else {
          // Tạo đánh giá mới
          await axios.post(getApiUrl(API_ENDPOINTS.RATINGS), ratingData);
          console.log('Đã thêm đánh giá mới:', newRating, 'sao');
        }
        
        // Tải lại danh sách đánh giá để cập nhật UI
        await loadRatings();
        
        alert(`✅ Đã đánh giá ${newRating} sao cho sản phẩm!`);
      } catch (error) {
        console.error('Error saving rating:', error);
        alert('❌ Có lỗi xảy ra khi lưu đánh giá. Vui lòng thử lại!');
      }
    };

    // Ghi chú: Tải đánh giá khi component mount hoặc productId thay đổi
    onMounted(() => {
      if (props.productId) {
        loadRatings();
      }
    });

    // Ghi chú: Watch productId để tải lại đánh giá khi chuyển sản phẩm
    watch(() => props.productId, (newProductId) => {
      if (newProductId) {
        userRating.value = 0; // Reset user rating
        loadRatings();
      }
    });

    return {
      authStore,
      userRating,
      averageRating,
      totalRatings,
      handleRatingChange
    };
  }
};
</script>

<style scoped>
/* Rating Section Styles */
.rating-section {
  border-top: 1px solid #eee;
  padding-top: 32px;
  margin-bottom: 32px;
}

.rating-section h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.rating-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.current-rating,
.user-rating,
.no-rating,
.login-prompt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.rating-text {
  font-weight: 500;
  color: #333;
  min-width: 140px;
}

.rating-count {
  color: #666;
  font-size: 14px;
  margin-left: 8px;
}

.rating-note {
  color: #ff6b00;
  font-weight: 600;
  font-size: 14px;
}

.user-rating {
  border: 2px solid #ff6b00;
  background-color: #fff3e0;
}

.login-prompt {
  background-color: #e3f2fd;
  border: 2px solid #2196f3;
}

.login-prompt .rating-text {
  color: #1976d2;
}

/* Responsive styles */
@media (max-width: 768px) {
  .rating-section {
    padding-top: 24px;
    margin-bottom: 24px;
  }

  .rating-section h3 {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .current-rating,
  .user-rating,
  .no-rating,
  .login-prompt {
    padding: 10px 12px;
    gap: 8px;
  }

  .rating-text {
    min-width: 120px;
    font-size: 14px;
  }

  .rating-count {
    font-size: 12px;
  }

  .rating-note {
    font-size: 12px;
  }
}
</style>
