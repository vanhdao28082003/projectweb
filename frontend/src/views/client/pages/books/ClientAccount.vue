<template>
    <div>
        <ClientAppHeader />
        <div class="container mt-3">
            <div class="page row">
                <!-- Thông tin tài khoản -->
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <h3>Thông tin tài khoản</h3>
                            <div class="account-info">
                                <div class="info-item">
                                    <strong>Họ và tên: </strong> {{ user.fullName }}
                                </div>
                                <div class="info-item">
                                    <strong>Email: </strong> {{ user.email }}
                                </div>
                                <div class="info-item">
                                    <strong>Số điện thoại: </strong> {{ user.phone }}
                                </div>
                                <div class="info-item">
                                    <strong>Địa chỉ: </strong> {{ user.address }}
                                </div>
                            </div>
                        </div>

                        <div class="account-actions">
                            <button v-if="!isEditing" class="btn btn-warning" @click="editAccount">Cập nhật</button>
                        </div>

                        <!-- Hiển thị form chỉnh sửa khi isEditing là true -->
                        <div v-if="isEditing" class="col-12 col-md-6">
                            <h3>Chỉnh sửa tài khoản</h3>
                            <form @submit.prevent="handleSubmit">
                                <input v-model="user.fullName" type="text" placeholder="Full Name" class="form-control" />
                                <input v-model="user.email" type="email" placeholder="Email" class="form-control" />
                                <input v-model="user.phone" type="text" placeholder="Phone Number" class="form-control" />
                                <input v-model="user.address" type="text" placeholder="Address" class="form-control" />

                                <div class="account-actions">
                                    <button type="submit" class="btn btn-success">Lưu lại</button>
                                    <button type="button" class="btn btn-secondary" @click="cancelEdit">Hủy bỏ</button>
                                </div>
                            </form>
                            <!-- Hiển thị thông báo lỗi nếu có -->
                            <div v-if="errorMessage" class="alert alert-danger mt-3">
                                {{ errorMessage }}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <ClientFooter />
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import ReaderService from "@/services/client/reader.service";

export default {
    data() {
        return {
            user: {
                fullName: '',
                email: '',
                phone: '',
                address: ''
            },
            errorMessage: '',
            isEditing: false, // Thêm biến để kiểm soát chế độ chỉnh sửa
        };
    },
    methods: {
        async getUserDetails() {
            try {
                const tokenUser = Cookies.get('tokenUser');
                if (!tokenUser) {
                    console.error('Không tìm thấy tokenUser trong cookie!');
                    return;
                }

                const response = await ReaderService.getInforUserByToken({ token: tokenUser });
                if (response) {
                    this.user = response;
                } else {
                    console.error('Không tìm thấy thông tin người dùng!');
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        },
        // Mở chế độ chỉnh sửa
        editAccount() {
            this.isEditing = true;
        },
        // Hủy bỏ chỉnh sửa
        cancelEdit() {
            this.isEditing = false;
        },
        // Lưu các thay đổi
        async handleSubmit() {
            try {
                const token = Cookies.get('tokenUser');
                const response = await ReaderService.updateUser(token, this.user);

                if (response && response.data && response.data.message) {
                    this.errorMessage = response.data.message;
                } else {
                    alert('User updated successfully');
                    this.isEditing = false;
                    this.errorMessage = '';
                }
            } catch (error) {
                console.error("Error updating user details:", error);
                this.errorMessage = 'An error occurred. Please try again later.';
            }
        }
    },
    mounted() {
        this.getUserDetails();
    },
};
</script>

<style scoped>
.page {
    text-align: left;
}

.account-info {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.info-item {
    margin-bottom: 15px;
}

.info-item strong {
    font-weight: bold;
    color: #333;
}

.account-actions {
    margin-top: 10px;
    margin-bottom: 20px; /* Thêm margin-bottom để tạo khoảng cách giữa nút và footer */
}

.account-actions button {
    margin-right: 10px;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

/* Form styling */
form {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}

/* Styles for the input fields */
input.form-control {
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
}

input.form-control:focus {
    border-color: #0056b3;
    outline: none;
}

/* Buttons styling */
.btn {
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
}

.btn-warning {
    background-color: #ffb700;
    color: white;
    border: none;
}

.btn-warning:hover {
    background-color: #e0a800;
    transform: scale(1.05);
}

.btn-success {
    background-color: #28a745;
    color: white;
    border: none;
}

.btn-success:hover {
    background-color: #218838;
    transform: scale(1.05);
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
}

.btn-secondary:hover {
    background-color: #5a6268;
    transform: scale(1.05);
}

h3 {
    color: #333;
    font-size: 1.5em;
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .account-info {
        padding: 15px;
    }

    .account-actions .btn-warning,
    .account-actions .btn-danger,
    .account-actions .btn-success,
    .account-actions .btn-secondary {
        width: 100%;
        margin-bottom: 10px;
    }

    .col-md-6 {
        flex: 0 0 100%;
    }
}

@media (max-width: 576px) {
    .info-item {
        font-size: 14px;
    }

    h3 {
        font-size: 1.3em;
    }
}
</style>
