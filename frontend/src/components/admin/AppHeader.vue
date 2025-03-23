<template>
  <nav class="navbar navbar-expand">
    <div class="navbar-brand-container">
      <a href="/admin/books">
        <img src="../../img/logoWeb.png" alt="Logo" class="logo">
      </a>
      <div class="mr-auto navbar-nav">
        <li class="nav-item">
          <router-link :to="{ name: 'book' }" class="nav-link" :class="{ active: $route.name === 'book' }">
            <h6><b>Quản lý kho sách</b></h6>
            <i class="fa-solid fa-book"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'borrow' }" class="nav-link" :class="{ active: $route.name === 'borrow' }">
            <h6><b>Quản lý mượn sách</b></h6>
            <i class="fa-solid fa-book-reader"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'reader' }" class="nav-link" :class="{ active: $route.name === 'reader' }">
            <h6><b>Quản lý người đọc</b></h6>
            <i class="fa-solid fa-user"></i>
          </router-link>
        </li>
      </div>
    </div>
    <div class="logout-container">
      <button class="btn btn-danger button-logout" @click="logout">
        Đăng xuất
      </button>
    </div>
  </nav>
</template>

<script>
import Authorization from "@/services/admin/authorization.service";
export default {
  computed: {},
  name: "app-header-admin",
  methods: {
    async logout() {
      // Xử lý đăng xuất ở đây
      try {
        const response = await Authorization.logOut();
        this.$router.push({ name: "login" });
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style scoped>
.navbar-brand-container {
  display: flex;
  align-items: center;
}

.logout-container {
  margin-left: auto;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.navbar-brand {
  margin-right: 20px;
  margin-left: 10%;
}

.nav-item {
  display: flex;
  width: auto;
  flex-grow: 1;
  margin-left: -60px;
}

.nav-link {
  display: flex;
  align-items: center;
  margin-right: 15px;
  position: relative;
  border-radius: 10px;
  background-color: #a3a09b;
  transition: all 0.2s linear;
}

.nav-link:hover {
  color: white;
  /* background-color: black; */
  border-radius: 10px;
  transform: scale(1.1);
}

.fa-book,
.fa-book-reader,
.fa-user {
  margin-left: 8px;
}

.navbar-nav {
  display: flex;
  justify-content: center;
  text-align: center;
  gap: 10px;
  width: 600px;
}

.logo,
.logo img {
  width: 300px;
  margin-top: -20%;
  margin-bottom: -63px;
  margin-left: -100px;
}

.btn-danger {
  margin-left: 15px;
}

.navbar-expand {
  background-color: #a3a09b;
  border-bottom: 2px solid rgb(100, 98, 98);
}

.nav-link.active {
  color: white;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
}
</style>