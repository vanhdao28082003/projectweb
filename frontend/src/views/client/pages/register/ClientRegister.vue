<template>
  <div>
    <div class="register_page">
      <a href="/auth/login" class="logo-link">
        <img class="logo" src="../../../../img/logoWeb.png" alt="">
      </a>
      <div class="container">
        <div class="add-new">
        <i class="fas fa-arrow-left" @click="goBack"></i>
        <span>
          Đăng kí tài khoản
        </span>
      </div>

        <div class="form">
          <form @submit.prevent="add" action="">
            <div class="form-item">
              <label class="label" for="fullName">Họ và tên:</label><br />
              <input class="input" type="text" id="fullName" v-model="formData.fullName" />
            </div>
            <div class="form-item">
              <label class="label" for="email">Email:</label><br />
              <input 
                class="input" 
                type="email" 
                id="email" 
                v-model="formData.email"
              />
              <!-- Display the error message if emailError is set -->
              <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </div>
            <div class="form-item">
              <label class="label" for="password">Password:</label><br />
              <input class="input" type="password" id="password" v-model="formData.password" />
            </div>
  
            <div class="form-item">
              <label class="label" for="address">Địa chỉ:</label><br />
              <input class="input" type="text" id="address" v-model="formData.address" />
            </div>
  
            <div class="form-item">
              <label class="label" for="phone">Số điện thoại:</label><br />
              <input class="input" type="text" id="phone" v-model="formData.phone" pattern="^0\d{9}$" title="Số điện thoại phải là 10 số và bắt đầu bằng số 0." />
              <!-- Hiển thị thông báo lỗi nếu phoneError được đặt -->
              <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
            </div>


            <button type="submit" class="btn btn-primary">Tạo tài khoản</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import ReaderService from "@/services/client/reader.service";

export default {
  components: {
    ClientAppHeader,
  },
  data() {
    return {
      formData: {
        fullName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      },
      emailError: "", // Thông báo lỗi email
      phoneError: "", // Thông báo lỗi số điện thoại
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1); // Quay lại trang trước đó
    },
    async add() {
      try {
        this.emailError = ""; // Đặt lại thông báo lỗi email
        this.phoneError = ""; // Đặt lại thông báo lỗi số điện thoại

        if (
          !this.formData.fullName ||
          !this.formData.email ||
          !this.formData.password
        ) {
          toast.error("Please fill in all required fields.", {
            autoClose: 3000,
          });
          return;
        }

        const response = await ReaderService.createUser(this.formData);
        toast.success("Added successfully!", {
          autoClose: 1200,
        });

        setTimeout(() => {
          this.$router.push({ name: "login-client" });
        }, 800);
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Error!";
        toast.error(errorMessage, { autoClose: 3000 });
      }
    },
  },
};
</script>


<style scoped>
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.register_page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('../../../../img/login.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.container {
  width: 100%;
  max-width: 500px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 30px;
  margin: 20px auto;
  text-align: center;
}

.logo {
  position: absolute;
  top: 10%;
  left: 5%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 25%;
  height: auto;
}

.add-new {
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
  font-size: 24px; /* Cỡ chữ */
  font-weight: bold; /* Đậm chữ */
  color: #333; /* Màu chữ */
  width: 100%; /* Đảm bảo container chiếm toàn bộ chiều rộng */
}

.add-new i {
  margin-right: 10px; /* Khoảng cách giữa icon và chữ */
  font-size: 28px; /* Cỡ icon */
  transition: transform 0.3s ease, color 0.3s ease; /* Hiệu ứng chuyển động và màu */
  cursor: pointer; /* Thêm hiệu ứng con trỏ chuột khi hover */
}

/* Hiệu ứng hover chỉ cho icon */
.add-new i:hover {
  transform: translateX(-5px); /* Di chuyển icon sang trái khi hover */
  color: #007bff; /* Màu icon khi hover */
}

.add-new span {
  display: inline-block; /* Đảm bảo chữ không bị kéo giãn ra */
}


.form {
  margin-top: 20px;
}

.form-item {
  margin: 10px 0;
  text-align: left;
}

.label {
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

.input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
}

.btn {
  width: 100%;
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.btn:active {
  background-color: #004080;
}

@media (max-width: 600px) {
  .container {
    padding: 20px;
    margin: 10px;
  }

  .add-new {
    font-size: 20px;
  }

  .logo {
    width: 100px;
  }
}
</style>
