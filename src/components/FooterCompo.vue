<template>
  <footer class="footer-section">
    <!-- Main Footer -->
    <div class="container py-5">
      <div class="row g-4">
        <!-- Brand Section -->
        <div class="col-lg-4 col-md-6">
          <div class="footer-brand">
            <h3 class="brand-title">THE C☕FFEE HOUSE</h3>
            <p class="brand-description">
              Nơi hội tụ những hương vị cà phê đặc biệt từ khắp nơi trên thế giới.
              Chúng tôi mang đến cho bạn trải nghiệm cà phê tuyệt vời nhất.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <i class="pi pi-facebook"></i>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <i class="pi pi-instagram"></i>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <i class="pi pi-twitter"></i>
              </a>
              <a href="#" class="social-link" aria-label="YouTube">
                <i class="pi pi-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-lg-2 col-md-6">
          <div class="footer-links">
            <h5 class="footer-title">Sản phẩm</h5>
            <ul class="links-list">
              <li><a href="#" class="footer-link">Cà phê</a></li>
              <li><a href="#" class="footer-link">Trà</a></li>
              <li><a href="#" class="footer-link">Bánh ngọt</a></li>
              <li><a href="#" class="footer-link">Thức uống đá</a></li>
              <li><a href="#" class="footer-link">Combo</a></li>
            </ul>
          </div>
        </div>

        <!-- Services -->
        <div class="col-lg-2 col-md-6">
          <div class="footer-links">
            <h5 class="footer-title">Dịch vụ</h5>
            <ul class="links-list">
              <li><a href="#" class="footer-link">Giao hàng</a></li>
              <li><a href="#" class="footer-link">Đặt bàn</a></li>
              <li><a href="#" class="footer-link">Sự kiện</a></li>
              <li><a href="#" class="footer-link">Catering</a></li>
              <li><a href="#" class="footer-link">Franchise</a></li>
            </ul>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="col-lg-4 col-md-6">
          <div class="footer-contact">
            <h5 class="footer-title">Liên hệ</h5>
            <div class="contact-info">
              <div class="contact-item">
                <i class="pi pi-map-marker contact-icon"></i>
                <div class="contact-details">
                  <p>123 Đường Nguyễn Huệ, Quận 1</p>
                  <p>TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="pi pi-phone contact-icon"></i>
                <div class="contact-details">
                  <p>Hotline: 1900 6936</p>
                  <p>Mobile: 0901 234 567</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="pi pi-envelope contact-icon"></i>
                <div class="contact-details">
                  <p>info@thecoffeehouse.vn</p>
                  <p>support@thecoffeehouse.vn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Section -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="newsletter-section">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <h5 class="newsletter-title">Đăng ký nhận tin tức mới nhất</h5>
                <p class="newsletter-desc">Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
              </div>
              <div class="col-lg-6">
                <div class="newsletter-form">
                  <div class="input-group">
                    <input
                      type="email"
                      class="form-control newsletter-input"
                      placeholder="Nhập email của bạn..."
                      v-model="email"
                    >
                    <Button @click="subscribeNewsletter" label="Đăng Ký" severity="warn" raised />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="footer-bottom">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <p class="copyright-text">
              © {{ currentYear }} The Coffee House. All rights reserved.
            </p>
          </div>
          <div class="col-lg-6">
            <div class="footer-bottom-links">
              <a href="#" class="bottom-link">Chính sách bảo mật</a>
              <a href="#" class="bottom-link">Điều khoản sử dụng</a>
              <a href="#" class="bottom-link">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import './../assets/css/footer.css';
export default {
  name: 'FooterCompo',
  data() {
    return {
      email: '',
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    subscribeNewsletter() {
      if (this.email) {
        // Simulate newsletter subscription
        alert('Cảm ơn bạn đã đăng ký nhận tin tức!');
        this.email = '';
      } else {
        alert('Vui lòng nhập email của bạn!');
      }
    }
  }
}
</script>

