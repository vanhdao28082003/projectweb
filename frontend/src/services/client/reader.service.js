import createApiClient from "./api.reader"

class ReaderService {
    constructor(baseUrl = "/api/reader") {
        this.apiClient = createApiClient(baseUrl)
    }

    async createUser(userData) {
        try {
          const response = await this.apiClient.post("/register", userData);
          return response.data;
        } catch (error) {
          throw error;
        }
      }

    async getAllUsers() {
        try {
            const response = await this.apiClient.get('/');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getNumberBookBorrowed(id_book) {
        try {
            const response = await this.apiClient.get(`/numberbookborrowed/${id_book}`);
            console.log(response.data.borrowedBookQuantity)
            return response.data.borrowedBookQuantity;
        } catch (error) {
            throw error;
        }
    }

    async returnBookBorrow(userId) {
        try {
            const response = await this.apiClient.delete(`/return/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async statusBookReturn(readerId,bookId,status) {
        try {
            const response = await this.apiClient.put(`/statusBookReturn/${readerId}/${bookId}`,{status});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const response = await this.apiClient.get(`/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUserByToken(formData) {
        try {
            const { reader } = (await this.apiClient.get(`/user`, { headers: { Authorization: `Bearer ${formData.get("tokenUser")}` } })).data;
            return reader;
        } catch (error) {
            throw error;
        }
    }
    

    async getInforUserByToken(formData) {
        try {
            // Lấy token từ đối tượng formData
            const token = formData.token; // Đảm bảo bạn truyền token theo đúng cách

            const { reader } = (await this.apiClient.get(`/userinfor`, { 
                headers: { Authorization: `Bearer ${token}` }
            })).data;

            return reader;
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra và đảm bảo base URL đúng
    async updateUserByToken(token, userData) {
        try {
            const response = await this.apiClient.put(`/${token}`, userData); // Đảm bảo `/api/reader/update` là đúng
            return response.data;
        } catch (error) {
            console.error("Error updating user details:", error);
            throw error;
        }
    }

    
    async updateUser(userId, userData) {
        try {
            const response = await this.apiClient.put(`/${userId}`,userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateFavorite(userId, favorite) {
        try {
            const response = await this.apiClient.put(`/${userId}`,{favorite});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateBorrow(token, borrow) {
        try {
            const response = await this.apiClient.put('/borrow', { token, borrow });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteBookBorrow(userId, borrow) {
        try {
            const response = await this.apiClient.put(`/${userId}`, { borrow });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const response = await this.apiClient.delete(`/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateBorrowStatus(userId, bookId, status) {
        try {
            const response = await this.apiClient.put(`/${userId}`, {
                bookId: bookId,
                status: status,
            });

            // Update local storage if the server request is successful
            const user = localStorage.getItem("user");
            if (user) {
                const userData = JSON.parse(user);
                const borrowItem = userData.borrow.find((item) => item.bookId === bookId);
                if (borrowItem) {
                    borrowItem.status = status;
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            }
            return response.data;
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            throw error;
        }
    }

    async updateUserDetails(userData) {
        try {
            // Gửi yêu cầu PUT tới API mà không cần token trong body (nếu token lưu trong cookie)
            const response = await this.apiClient.put('/update', userData, {
                token: tokenUser
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user details:", error);
            throw error;
        }
    }
    
}
export default new ReaderService();
