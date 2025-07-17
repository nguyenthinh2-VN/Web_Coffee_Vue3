<template>
  <div class="about">
    <h2>Câu chuyện về Coffee House</h2>
    <p>
      The Coffee House là nơi mỗi tách cà phê không chỉ mang hương vị đậm đà mà còn chứa đựng câu chuyện kết nối giữa con người với con người.
      Chúng tôi tin rằng một không gian gần gũi và ấm áp sẽ là chất xúc tác để sẻ chia cảm xúc, truyền cảm hứng và tạo nên những giá trị tinh thần bền vững cho cộng đồng hiện đại.
    </p>

    <div class="filter-buttons">
      <button><router-link to="/blog">Blog</router-link></button>
    </div>

    <div class="stories">
      <div class="story">
        <img src="@/assets/hinh1.png" alt="story" />
        <h4>NGƯỢC LÊN TÂY BẮC GÓI VỊ MỘC VỀ XUÔI</h4>
        <p class="date">16/08/2023</p>
        <p>
          Những dải ruộng bậc thang xanh mướt, các cô gái Thái trong điệu múa xòe hoa rộn ràng sắc màu…
          chuyến đi đến Tây Bắc của chúng tôi không chỉ là hành trình khám phá cảnh đẹp, mà còn là dịp để thấu hiểu văn hóa bản địa,
          để rồi mang tinh thần mộc mạc ấy gói trọn vào từng ly cà phê.
        </p>
      </div>
      <div class="story">
        <img src="@/assets/hinh2.png" alt="story" />
        <h4>SIGNATURE BY THE COFFEE HOUSE</h4>
        <p class="date">19/01/2023</p>
        <p>
          Tại trung tâm thương mại Crescent Mall sôi động, The Coffee House chính thức ra mắt mô hình SIGNATURE –
          một không gian mới mẻ, nơi bạn không chỉ thưởng thức cà phê mà còn được trải nghiệm nghệ thuật pha chế và phong cách sống hiện đại.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: 2rem;
  background-color: white;
}
h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.filter-buttons {
  margin: 1rem 0;
}
.filter-buttons button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 20px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s;
}
.filter-buttons button:hover {
  background-color: #ddd;
}

.stories {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
}
.story {
  width: 48%;
  background: #fff;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.story:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
.story img {
  width: 100%;
  border-radius: 10px 10px 0 0;
  transition: transform 0.3s;
}
.story:hover img {
  transform: scale(1.03);
}
.story h4 {
  margin: 1rem 0 0.5rem;
}
.story .date {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
}
.story p {
  padding: 0 1rem 1rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .story {
    width: 100%;
  }
}
</style>
