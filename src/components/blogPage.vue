<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Coffee Stories</h1>
        <p class="hero-subtitle">
          Khám phá thế giới cà phê qua những câu chuyện thú vị
        </p>
      </div>
    </div>
    <!-- Main Content -->
    <div class="container">
      <!-- Search and Filter -->
      <div class="search-section">
        <div class="search-bar">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Tìm kiếm bài viết..."
              class="search-input"
            />
          </IconField>
        </div>

        <div class="filter-chips">
          <Chip
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :class="{ 'active-chip': selectedCategory === category.id }"
            @click="filterByCategory(category.id)"
            clickable
          />
          <Chip
            label="Tất cả"
            :class="{ 'active-chip': selectedCategory === null }"
            @click="filterByCategory(null)"
            clickable
          />
        </div>
      </div>

      <!-- Blog Posts Grid -->
      <div class="blog-grid">
        <Card
          v-for="post in filteredPosts"
          :key="post.id"
          class="blog-card"
          @click="openPost(post)"
        >
          <template #header>
            <img :src="post.image" :alt="post.title" class="blog-image" />
          </template>

          <template #title>
            <h3 class="blog-title">{{ post.title }}</h3>
          </template>

          <template #subtitle>
            <div class="blog-meta">
              <Tag
                :value="post.category"
                severity="info"
                class="category-tag"
              />
              <span class="blog-date">{{ formatDate(post.date) }}</span>
            </div>
          </template>

          <template #content>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
          </template>

          <template #footer>
            <div class="blog-footer">
              <div class="author-info">
                <Avatar
                  :image="post.author.avatar"
                  :label="post.author.name.charAt(0)"
                  shape="circle"
                  size="small"
                />
                <span class="author-name">{{ post.author.name }}</span>
              </div>
              <div class="read-time">
                <i class="pi pi-clock"></i>
                <span>{{ post.readTime }} phút đọc</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Load More Button -->
      <div class="load-more-section" v-if="hasMorePosts">
        <Button
          label="Xem thêm bài viết"
          icon="pi pi-plus"
          @click="loadMorePosts"
          class="load-more-btn"
          outlined
        />
      </div>
    </div>

    <!-- Blog Post Dialog -->
    <Dialog
      :visible="showPostDialog"
      @update:visible="showPostDialog = $event"
      :header="selectedPost?.title"
      modal
      class="blog-dialog"
      :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <div v-if="selectedPost" class="post-content">
        <img
          :src="selectedPost.image"
          :alt="selectedPost.title"
          class="post-image"
        />

        <div class="post-meta">
          <Tag :value="selectedPost.category" severity="info" />
          <span class="post-date">{{ formatDate(selectedPost.date) }}</span>
          <div class="author-info">
            <Avatar
              :image="selectedPost.author.avatar"
              :label="selectedPost.author.name.charAt(0)"
              shape="circle"
              size="small"
            />
            <span>{{ selectedPost.author.name }}</span>
          </div>
        </div>

        <div class="post-body" v-html="selectedPost.content"></div>

        <div class="post-actions">
          <Button icon="pi pi-heart" label="Thích" text />
          <Button icon="pi pi-share-alt" label="Chia sẻ" text />
          <Button icon="pi pi-bookmark" label="Lưu" text />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Chip from "primevue/chip";
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import Dialog from "primevue/dialog";

export default {
  name: "BlogPage",
  components: {
    Card,
    Button,
    InputText,
    IconField,
    InputIcon,
    Chip,
    Tag,
    Avatar,
    Dialog,
  },
  setup() {
    const searchQuery = ref("");
    const selectedCategory = ref(null);
    const showPostDialog = ref(false);
    const selectedPost = ref(null);
    const hasMorePosts = ref(true);

    const categories = ref([
      { id: 1, name: "Cà phê" },
      { id: 2, name: "Trà" },
      { id: 3, name: "Barista Tips" },
      { id: 4, name: "Văn hóa" },
    ]);

    const blogPosts = ref([
      {
        id: 1,
        title: "Bí quyết pha cà phê sữa đá hoàn hảo",
        excerpt:
          "Khám phá những bí quyết để pha một tách cà phê sữa đá đậm đà, thơm ngon như ở quán...",
        content: `
          <p>Cà phê sữa đá là thức uống quen thuộc của người Việt Nam. Để có một tách cà phê sữa đá hoàn hảo, bạn cần chú ý đến những yếu tố sau:</p>
          <h3>1. Chọn cà phê chất lượng</h3>
          <p>Sử dụng hỗn hợp cà phê Robusta và Arabica với tỷ lệ 7:3 để có được vị đắng đậm đà và hương thơm tinh tế.</p>
          <h3>2. Kỹ thuật pha</h3>
          <p>Sử dụng phin cà phê truyền thống, cho cà phê vào phin với lượng vừa phải, đổ nước sôi từ từ...</p>
          <h3>3. Sữa đặc và đá</h3>
          <p>Sử dụng sữa đặc có đường chất lượng tốt và đá viên trong suốt để giữ nguyên hương vị.</p>
        `,
        image: "https://files.catbox.moe/0xpnfw.png",
        category: "Cà phê",
        categoryId: 1,
        date: new Date("2024-01-15"),
        author: {
          name: "Minh Barista",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        readTime: 5,
      },
      {
        id: 2,
        title: "Lịch sử và văn hóa cà phê Việt Nam",
        excerpt:
          "Tìm hiểu về hành trình phát triển của cà phê từ khi du nhập vào Việt Nam đến ngày nay...",
        content: `
          <p>Cà phê được du nhập vào Việt Nam từ thế kỷ 19 bởi người Pháp. Từ đó, cà phê đã trở thành một phần không thể thiếu trong văn hóa Việt Nam.</p>
          <h3>Giai đoạn đầu (1857-1945)</h3>
          <p>Người Pháp bắt đầu trồng cà phê tại Đà Lạt và các vùng cao nguyên...</p>
          <h3>Thời kỳ phát triển (1945-1990)</h3>
          <p>Cà phê dần trở thành cây trồng kinh tế quan trọng...</p>
        `,
        image:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=250&fit=crop",
        category: "Văn hóa",
        categoryId: 4,
        date: new Date("2024-01-10"),
        author: {
          name: "Thu Historian",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        },
        readTime: 8,
      },
      {
        id: 3,
        title: "Nghệ thuật Latte Art cho người mới bắt đầu",
        excerpt:
          "Hướng dẫn chi tiết các bước cơ bản để tạo ra những hình vẽ đẹp mắt trên tách cà phê...",
        content: `
          <p>Latte Art là nghệ thuật tạo hình trên bề mặt cà phê bằng cách đổ sữa tươi đã được đánh bọt.</p>
          <h3>Chuẩn bị dụng cụ</h3>
          <p>Máy pha cà phê espresso, bình đánh sữa, sữa tươi nguyên chất...</p>
          <h3>Kỹ thuật cơ bản</h3>
          <p>Bắt đầu với hình trái tim đơn giản, sau đó chuyển sang lá cây và hoa tulip...</p>
        `,
        image: "https://files.catbox.moe/nypx9w.png",
        category: "Barista Tips",
        categoryId: 3,
        date: new Date("2024-01-08"),
        author: {
          name: "Long Barista",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        readTime: 6,
      },
      {
        id: 4,
        title: "Khám phá thế giới trà sữa Oolong",
        excerpt:
          "Tìm hiểu về nguồn gốc và cách thưởng thức trà Oolong trong các món trà sữa hiện đại...",
        content: `
          <p>Trà Oolong là loại trà bán lên men, có hương vị độc đáo nằm giữa trà xanh và trà đen.</p>
          <h3>Nguồn gốc Oolong</h3>
          <p>Trà Oolong có nguồn gốc từ Trung Quốc, được trồng chủ yếu ở Phúc Kiến và Đài Loan...</p>
          <h3>Oolong trong trà sữa</h3>
          <p>Việc kết hợp Oolong với sữa tạo nên hương vị đặc biệt, vừa thơm vừa đậm đà...</p>
        `,
        image: "https://files.catbox.moe/h7ad5w.png",
        category: "Trà",
        categoryId: 2,
        date: new Date("2024-01-05"),
        author: {
          name: "Linh Tea Master",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        },
        readTime: 7,
      },
      {
        id: 5,
        title: "Cà phê trứng - Đặc sản Hà Nội",
        excerpt:
          "Câu chuyện về món cà phê trứng nổi tiếng và cách pha chế độc đáo của người Hà Nội...",
        content: `
          <p>Cà phê trứng là một phát minh độc đáo của người Việt Nam, đặc biệt là Hà Nội.</p>
          <h3>Lịch sử ra đời</h3>
          <p>Được tạo ra vào những năm 1940 bởi ông Nguyễn Văn Giảng tại quán cà phê Giảng...</p>
          <h3>Cách pha chế</h3>
          <p>Sử dụng lòng đỏ trứng gà, sữa đặc và cà phê đen đậm đà...</p>
        `,
        image: "https://files.catbox.moe/k7ywjx.png",
        category: "Cà phê",
        categoryId: 1,
        date: new Date("2024-01-03"),
        author: {
          name: "Hùng Heritage",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        },
        readTime: 5,
      },
      {
        id: 6,
        title: "Kombucha - Xu hướng thức uống lành mạnh",
        excerpt:
          "Tìm hiểu về Kombucha, thức uống lên men có lợi cho sức khỏe đang được ưa chuộng...",
        content: `
          <p>Kombucha là thức uống lên men từ trà, có chứa men vi sinh có lợi cho đường ruột.</p>
          <h3>Lợi ích sức khỏe</h3>
          <p>Kombucha chứa probiotics, vitamin B và C, giúp tăng cường hệ miễn dịch...</p>
          <h3>Hương vị đa dạng</h3>
          <p>Có thể kết hợp với nhiều loại trái cây như đào, yuzu để tạo hương vị độc đáo...</p>
        `,
        image: "https://files.catbox.moe/qo6dbo.png",
        category: "Trà",
        categoryId: 2,
        date: new Date("2024-01-01"),
        author: {
          name: "An Wellness",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        },
        readTime: 4,
      },
    ]);

    const filteredPosts = computed(() => {
      let posts = blogPosts.value;

      if (selectedCategory.value) {
        posts = posts.filter(
          (post) => post.categoryId === selectedCategory.value
        );
      }

      if (searchQuery.value) {
        posts = posts.filter(
          (post) =>
            post.title
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return posts;
    });

    const filterByCategory = (categoryId) => {
      selectedCategory.value = categoryId;
    };

    const openPost = (post) => {
      selectedPost.value = post;
      showPostDialog.value = true;
    };

    const formatDate = (date) => {
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const loadMorePosts = () => {
      // Simulate loading more posts
      hasMorePosts.value = false;
    };

    return {
      searchQuery,
      selectedCategory,
      showPostDialog,
      selectedPost,
      hasMorePosts,
      categories,
      blogPosts,
      filteredPosts,
      filterByCategory,
      openPost,
      formatDate,
      loadMorePosts,
    };
  },
};
</script>

<style scoped>
.blog-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #e8f4fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  border-radius: 50px;
  border: 2px solid #e1e8ed;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-chips {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-chips .p-chip {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-chips .p-chip:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.filter-chips .active-chip {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.blog-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.blog-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.blog-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .blog-image {
  transform: scale(1.05);
}

.blog-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-tag {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.blog-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.blog-excerpt {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.blog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-name {
  font-weight: 500;
  color: #495057;
}

.read-time {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.load-more-section {
  text-align: center;
}

.load-more-btn {
  padding: 1rem 2rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #667eea;
  color: #667eea;
  font-weight: 600;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.blog-dialog .p-dialog-content {
  padding: 0;
}

.post-content {
  max-height: 70vh;
  overflow-y: auto;
}

.post-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 1.5rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
  flex-wrap: wrap;
}

.post-body {
  padding: 0 1.5rem;
  line-height: 1.8;
  color: #495057;
}

.post-body h3 {
  color: #2c3e50;
  margin: 2rem 0 1rem 0;
  font-weight: 600;
}

.post-body p {
  margin-bottom: 1.5rem;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .blog-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 1rem;
  }

  .search-section {
    padding: 1.5rem;
  }

  .filter-chips {
    justify-content: center;
  }
}
</style>