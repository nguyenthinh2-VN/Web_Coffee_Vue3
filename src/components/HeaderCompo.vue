<template>
  <nav class="navbar navbar-expand-lg fixed-top bg-white opacity-75">
    <div class="container">
      <a class="navbar-brand" href="#">THE C☕FFEE HOUSE</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="offcanvas offcanvas-end" id="offcanvasNavbar" tabindex="-1">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">THE C☕FFEE HOUSE</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Trà</a>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/menu">Menu</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">Chuyện Nhà</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Cửa hàng</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Tuyển dụng</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 5px 0;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.4rem;
}

.nav-link {
  color: #000 !important;
  font-weight: bold;
  padding: 0.5rem 1rem !important;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ff6600 !important;
}

.navbar-toggler {
  border: none;
  padding: 0;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.offcanvas {
  width: 300px;
}
.offcanvas-body{
  font-size: 15px;
  font-weight: bold;

}

@media (min-width: 992px) {
  .navbar-nav {
    gap: 1rem;
  }
}
</style>
