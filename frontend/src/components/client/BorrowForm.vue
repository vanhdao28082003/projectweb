<template>
    <div class="form">
        <form @submit.prevent="onSubmit">
            <div class="form-item">
                <label class="label" for="bookTitle">Tên sách:</label><br />
                <input class="input" type="text" id="bookTitle" v-model="formData.bookTitle" disabled />
            </div>

            <div class="form-item">
                <label class="label" for="price">Giá:</label><br />
                <input class="input" type="number" id="price" v-model="formData.price" disabled />
            </div>

            <div class="form-item">
                <label class="label" for="quantity">Số lượng:</label><br />
                <input class="input" type="number" id="quantity" v-model="formData.quantity" disabled />
            </div>

            <div class="form-item">
                <label class="label" for="borrowDate">Ngày mượn:</label><br />
                <input class="input" type="date" id="borrowDate" v-model="formData.borrowDate" />
            </div>

            <div class="form-item">
                <label class="label" for="returnDate">Ngày trả:</label><br />
                <input class="input" type="date" id="returnDate" v-model="formData.returnDate" />
            </div>

            <button type="submit" class="btn btn-primary">Mượn Sách</button>
            <div v-if="errorMessage" class="error-message">
                <p>{{ errorMessage }}</p>
            </div>
        </form>
    </div>
</template>

<script>
import BookService from "@/services/client/book.service";
import ReaderService from "@/services/client/reader.service";
import Cookies from 'js-cookie';

export default {
    props: ["bookId"],
    data() {
        return {
            formData: {
                id_book: this.bookId,
                bookTitle: "",
                price: 0,
                quantity: 1,
                borrowDate: "", // Đây sẽ tự động gán ngày mượn là ngày hôm nay
                returnDate: "",
            },
            token: Cookies.get('tokenUser'),
            errorMessage: "", // Thêm thuộc tính để lưu lỗi
            book: {}, // Thêm biến để lưu thông tin sách
            remain: 0, // Thêm biến để tính số sách còn lại
        };
    },
    mounted() {
        this.retrieve(this.bookId);
        const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay dưới định dạng YYYY-MM-DD
        this.formData.borrowDate = today; // Gán ngày hôm nay cho trường borrowDate
    },
    methods: {
        async retrieve(bookId) {
            try {
                const book = await BookService.get(bookId);
                if (book) {
                    this.book = book; // Lưu thông tin sách vào biến book
                    this.formData.bookTitle = book.bookTitle;
                    this.formData.price = book.price;
                    this.formData.id_book = bookId;
                    this.remain = book.quantity; // Gán số lượng sách còn lại
                } else {
                    console.log("Book not found");
                    this.errorMessage = "Không tìm thấy sách.";
                }
            } catch (error) {
                console.log(error);
                this.errorMessage = "Có lỗi xảy ra khi tải thông tin sách.";
            }
        },

        async updateBook() {
            try {
                // Kiểm tra nếu book đã được lấy thành công
                if (!this.book || !this.book.quantity) {
                    this.errorMessage = "Thông tin sách không hợp lệ.";
                    return null;  // Dừng lại nếu có lỗi, trả về null
                }

                // Lấy số lượng sách đã được mượn
                const currentBookBorrow = await ReaderService.getNumberBookBorrowed(this.formData.id_book);
                this.remain = this.book.quantity - currentBookBorrow;

                // Kiểm tra nếu số lượng mượn lớn hơn số lượng còn lại
                if (this.formData.quantity > this.remain) {
                    this.errorMessage = `Số lượng mượn lớn hơn số lượng sách còn lại (${this.remain} quyển).`;
                    return null;  // Dừng lại nếu có lỗi, trả về null
                }

                // Kiểm tra ngày trả có nhỏ hơn ngày mượn không
                const borrowDate = new Date(this.formData.borrowDate);
                const returnDate = new Date(this.formData.returnDate);
                if (returnDate < borrowDate) {
                    this.errorMessage = "Ngày trả không thể nhỏ hơn ngày mượn.";
                    return null;  // Dừng lại nếu có lỗi, trả về null
                }

                // Tiến hành gọi API để mượn sách nếu không có lỗi
                const response = await ReaderService.updateBorrow(this.token, this.formData);

                // Kiểm tra mã phản hồi từ API
                if (response.status === 400 || response.status === 404) {
                    this.errorMessage = response.data.message || "Có lỗi xảy ra khi mượn sách.";
                    return null;  // Dừng lại nếu có lỗi từ API, trả về null
                }

                console.log("Borrow response:", response);
                this.errorMessage = "";  // Reset lỗi nếu thành công
                return response;  // Trả về phản hồi thành công
            } catch (error) {
                console.log("Error during borrowing book:", error);
                this.errorMessage = "Có lỗi xảy ra khi mượn sách.";
                return null;  // Đảm bảo lỗi được bắt đúng cách và không tiếp tục
            }
        },

        async onSubmit() {
            const response = await this.updateBook();
            if (response) {  // Chỉ phát sự kiện thành công khi không có lỗi
                this.$emit('borrow-success');
            }
        },
    },
};
</script>

<style scoped>
.form-item {
    text-align: left;
    padding: 10px;
}

.label {
    font-weight: bold;
}

.input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn-primary {
    margin-top: 20px;
    background-color: #a3a09b;
    border: none;
    padding: 10px;
    cursor: pointer;
    color: #fff;
    border-radius: 5px;
}

.btn-primary:hover {
    background-color: #6f6e6d;
}

.error-message {
    color: red;
    font-weight: bold;
    margin-top: 10px;
}
</style>
