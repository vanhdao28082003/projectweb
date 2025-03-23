<template>
    <div class="page">
        <ClientAppHeader />
        <div class="container mt-3">
            <h3 class="name"><b>Danh Sách Sách Đã Mượn</b></h3>
            <template v-if="reader.borrow && reader.borrow.length > 0">
                <table class="table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên sách</th>
                            <th>Số lượng</th>
                            <th>Ngày mượn</th>
                            <th>Ngày trả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(borrowedBook, index) in paginatedBooks" :key="borrowedBook._id">
                            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
                            <!-- Đảm bảo đánh số STT đúng khi phân trang -->
                            <td>{{ getBookName(borrowedBook.id_book) }}</td>
                            <td>{{ borrowedBook.initialQuantity }}</td>
                            <td>{{ borrowedBook.borrowDate }}</td>
                            <td>{{ borrowedBook.returnDate }}</td>
                            <td class="text-primary">
                                {{ borrowedBook.status === 'accepted' ? 'Đã duyệt' : borrowedBook.status === 'refused' ?
                                    'Từ chối' :
                                    borrowedBook.status === 'returned' ? 'Đã trả' : borrowedBook.status === 'processing' ?
                                'Chờ xử lí' : 'Unknown' }}
                            </td>
                            <td>
                                <button v-if="borrowedBook.status === 'processing'" class="btn btn-warning"
                                    @click="statusBookReturn(reader, borrowedBook, 'refused')">
                                    Hủy yêu cầu
                                </button>
                                <template v-if="borrowedBook.status === 'accepted'">
                                    <button class="btn btn-danger"
                                        @click="statusBookReturn(reader, borrowedBook, 'returned')">
                                        Trả sách
                                    </button>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Phân trang -->
                <div class="pagination-container mt-4 mb-5">
                    <button class="btn btn-outline-secondary" :disabled="currentPage === 1"
                        @click="goToPage(currentPage - 1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="mx-2">Trang {{ currentPage }} / {{ totalPages }}</span>
                    <button class="btn btn-outline-secondary" :disabled="currentPage === totalPages"
                        @click="goToPage(currentPage + 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

            </template>
            <template v-else>
                <p><i>Bạn chưa có đăng ký đơn mượn nào.</i></p>
            </template>
        </div>
        <ClientFooter />
    </div>
</template>

<script>
import ClientBookDetail from "@/components/client/ClientBookDetail.vue";
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import ClientInputSearch from "@/components/client/ClientInputSearch.vue";
import ClientBookList from "@/components/client/ClientBookList.vue";
import ClientFooter from "@/components/client/ClientFooter.vue";

import BookService from "@/services/client/book.service";
import readerService from "@/services/client/reader.service";
import Cookies from 'js-cookie';

export default {
    components: {
        ClientBookDetail,
        ClientInputSearch,
        ClientBookList,
        ClientAppHeader,
        ClientFooter,
    },
    data() {
        return {
            books: [],
            activeIndex: -1,
            searchText: "",
            token: "",
            reader: {},
            currentPage: 1,
            pageSize: 4, // Số sách trên mỗi trang
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
            this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
        },
    },
    computed: {
        booksStrings() {
            return this.books.map((book) => {
                const { bookTitle, price, quantity, publishYear, author, thumbnail } = book;
                return [
                    bookTitle,
                    price,
                    quantity,
                    publishYear,
                    author,
                    thumbnail,
                ].join("");
            });
        },
        filteredBooks() {
            if (!this.searchText) return this.books;
            return this.books.filter((_book, index) =>
                this.booksStrings[index].includes(this.searchText)
            );
        },
        activeBook() {
            if (this.activeIndex < 0) return null;
            return this.filteredBooks[this.activeIndex];
        },
        filteredBooksCount() {
            return this.filteredBooks.length;
        },


        paginatedBooks() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.reader.borrow.slice(startIndex, endIndex); // Phân trang cho danh sách sách mượn của độc giả
        },
        totalPages() {
            return Math.ceil(this.reader.borrow.length / this.pageSize); // Tổng số trang dựa trên số sách mượn
        },

    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
                console.log(this.books); // Kiểm tra dữ liệu sách nhận được từ API
            } catch (error) {
                console.log(error);
            }
        },
        async retrieveReaders() {
            try {
                const token = Cookies.get('tokenUser');
                this.token = token;
                let formData = new FormData();
                formData.append("tokenUser", token);
                this.reader = await readerService.getUserByToken(formData);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin độc giả:', error);
            }
        },
        async statusBookReturn(reader, borrowedBook, status) {
            try {
                const response = await readerService.statusBookReturn(
                    reader._id,
                    borrowedBook.id_book,
                    status
                );
                await this.retrieveReaders();
                await this.retrieveBooks();
            } catch (error) {
                console.log(error);
            }
        },
        getBookName(bookId) {
            const book = this.books.find((book) => book._id === bookId);
            if (!book || !book.bookTitle) {
                console.log(`Không tìm thấy sách với id: ${bookId}`);
                return "Unknown"; // Nếu không tìm thấy sách hoặc không có tên sách, trả về "Unknown"
            }
            return book.bookTitle; // Trả về tên sách nếu tìm thấy
        },
        refreshList() {
            this.retrieveBooks();
            this.searchText = "";
            this.activeIndex = -1;
        },
        goToPage(pageNumber) {
            if (pageNumber >= 1 && pageNumber <= this.totalPages) {
                this.currentPage = pageNumber;
            }
        }
    },
    mounted() {
        this.retrieveBooks();
        this.retrieveReaders();
    },
};
</script>

<style scoped>
/* Đảm bảo toàn bộ trang sử dụng Flexbox */
html,
body {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
}

/* Container sẽ chiếm hết không gian còn lại */
.container {
    flex-grow: 1;
    padding-bottom: 20px;
    /* Thêm khoảng cách dưới nếu cần */
}

/* Footer luôn ở dưới cùng của trang */
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* Đảm bảo chiều cao của body đủ lớn */
}

footer {
    margin-top: auto;
    /* Đẩy footer xuống dưới cùng */
}

.name {
    text-align: center;
    color: red;
    font-style: italic;
    margin-bottom: 10px;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

th {
    background-color: #c5c3c3;
    color: black;
}

tr:hover {
    background-color: #f2f2f2;
}

td button {
    margin-right: 5px;
}

td:nth-child(2) {
    text-align: left;
    width: 30%;
}

td:nth-child(3) {
    width: 7%;
}

.pagination-container {
    display: flex;
    justify-content: center;
    /* Căn giữa phần tử con theo chiều ngang */
    align-items: center;
    /* Căn giữa phần tử con theo chiều dọc */
    margin-top: 20px;
    margin-bottom: 20px;
}

.pagination-container button {
    margin: 0 10px;
    /* Thêm khoảng cách giữa các nút */
}

.pagination-container span {
    font-size: 16px;
    /* Tùy chỉnh kích thước chữ */
    font-weight: bold;
    /* Làm đậm số trang */
}
</style>
