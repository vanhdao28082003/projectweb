<template>
    <div>
        <AppHeader />
        <div class="container mt-3">
            <div class="row">
                <div class="col-md-8" style="margin-bottom: 10px;">
                    <InputSearch v-model="searchText" />
                </div>
                <div class="col-md-4">
                    <!-- Dropdown để lọc theo trạng thái -->
                    <select v-model="selectedStatus" class="form-select" @change="filterByStatus">
                        <option value="">Tất cả trạng thái</option>
                        <option value="accepted">Đã duyệt</option>
                        <option value="refused">Từ chối</option>
                        <option value="returned">Đã trả</option>
                        <option value="processing">Chờ xử lí</option>
                    </select>
                </div>
            </div>

            <h3 class="text-danger">
                <b><i>Danh sách mượn sách của độc giả</i></b>
            </h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Độc giả</th>
                        <th>Tên sách</th>
                        <th>Số lượng</th>
                        <th>Ngày mượn</th>
                        <th>Ngày trả</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(reader, readerIndex) in paginatedReaders" :key="readerIndex">
                        <template v-if="reader.borrow.length > 0">
                            <tr v-for="(borrowedBook, bookIndex) in reader.borrow" :key="bookIndex">
                                <td>{{ getGlobalIndex(readerIndex, bookIndex) }}</td>
                                <td>{{ reader.fullName }}</td>
                                <td>{{ getBookName(borrowedBook.id_book) }}</td>
                                <td>{{ borrowedBook.initialQuantity }}</td>
                                <td>{{ borrowedBook.borrowDate }}</td>
                                <td>{{ borrowedBook.returnDate }}</td>
                                <td class="text-primary">
                                    {{ borrowedBook.status === 'accepted' ? 'Đã duyệt' :
                                        borrowedBook.status === 'refused' ? 'Từ chối' :
                                            borrowedBook.status === 'returned' ? 'Đã trả' :
                                                borrowedBook.status === 'processing' ? 'Chờ xử lí' : 'Unknown' }}
                                </td>
                                <td>
                                    <template v-if="borrowedBook.status === 'accepted'">
                                        <button disabled @click="markAsReturned(reader, borrowedBook)"
                                            class="btn btn-warning">
                                            Chưa trả
                                        </button>
                                    </template>
                                    <template v-else-if="borrowedBook.status === 'returned'">
                                        <button @click="deleteBorrowedBook(reader, borrowedBook)"
                                            class="btn btn-danger">
                                            Xóa
                                        </button>
                                    </template>
                                    <template v-else-if="borrowedBook.status === 'refused'">
                                        <button @click="deleteBorrowedBook(reader, borrowedBook)"
                                            class="btn btn-danger">
                                            Xóa
                                        </button>
                                    </template>
                                    <template v-else>
                                        <button @click="statusBook(reader, borrowedBook, 'accepted')"
                                            class="btn btn-success">
                                            Duyệt
                                        </button>
                                        <button @click="statusBook(reader, borrowedBook, 'refused')"
                                            class="btn btn-danger">
                                            Từ chối
                                        </button>
                                    </template>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
            <!-- Pagination controls -->
            <div class="pagination-container mt-4 mb-5 text-center">
                <button 
                    class="btn btn-outline-secondary" 
                    :disabled="currentPage === 1" 
                    @click="goToPage(currentPage - 1)"
                >
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="mx-2">Trang {{ currentPage }} / {{ totalPages }}</span>
                <button 
                    class="btn btn-outline-secondary" 
                    :disabled="currentPage === totalPages" 
                    @click="goToPage(currentPage + 1)"
                >
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/admin/AppHeader.vue";
import BookService from "@/services/admin/book.service";
import EmployeeService from "@/services/admin/employee.service";
import InputSearch from '@/components/admin/InputSearch.vue';

export default {
    components: {
        AppHeader,
        InputSearch,
    },
    data() {
        return {
            books: [],
            readers: [],
            searchText: '',
            activeIndex: -1,
            currentPage: 1,
            itemsPerPage: 4, // Số lượng bản ghi trên mỗi trang
            selectedStatus: '', // Trạng thái đã chọn từ dropdown
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
            this.currentPage = 1; // Reset về trang đầu khi tìm kiếm
        },
    },
    computed: {
        // Tính toán tổng số trang dựa trên số lượng độc giả đã lọc
        totalPages() {
            return Math.ceil(this.filteredReaders.length / this.itemsPerPage);
        },
        // Lọc các độc giả theo searchText và trạng thái
        filteredReaders() {
            let filtered = this.readers;
            if (this.searchText.trim() !== '') {
                filtered = filtered.filter(reader =>
                    reader.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    reader.borrow.some(borrowedBook =>
                        this.getBookName(borrowedBook.id_book).toLowerCase().includes(this.searchText.toLowerCase())
                    )
                );
            }
            if (this.selectedStatus) {
                filtered = filtered.filter(reader =>
                    reader.borrow.some(borrowedBook =>
                        borrowedBook.status === this.selectedStatus
                    )
                );
            }
            return filtered;
        },
        // Phân trang các độc giả đã lọc
        paginatedReaders() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredReaders.slice(start, end);
        },
    },
    methods: {
        getGlobalIndex(readerIndex, bookIndex) {
            let globalIndex = 0;
            // Tính toán chỉ số toàn cục dựa trên danh sách đã lọc (filteredReaders) thay vì toàn bộ (readers)
            for (let i = 0; i < readerIndex; i++) {
                globalIndex += this.filteredReaders[i].borrow.length; // Cộng số lượng sách đã mượn của các độc giả trước đó trong danh sách lọc
            }
            return globalIndex + bookIndex + 1;
        },
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        async retrieveReaders() {
            try {
                this.readers = await EmployeeService.getReaders();
            } catch (error) {
                console.log(error);
            }
        },
        async statusBook(reader, borrowedBook, status) {
            try {
                await EmployeeService.statusBook(reader._id, borrowedBook.id_book, status);
                await this.retrieveReaders();
            } catch (error) {
                console.log(error);
            }
        },
        async markAsReturned(reader, borrowedBook) {
            try {
                await EmployeeService.statusBook(reader._id, borrowedBook.id_book, 'returned');
                await this.retrieveReaders();
            } catch (error) {
                console.log(error);
            }
        },
        async deleteBorrowedBook(reader, borrowedBook) {
            const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa người mượn cuốn sách này?");
            if (isConfirmed) {
                try {
                    await EmployeeService.deleteBorrowedBook(reader._id, borrowedBook.id_book);
                    await this.retrieveReaders();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        getBookName(bookId) {
            const book = this.books.find((book) => book._id === bookId);
            return book ? book.bookTitle : "Không tìm thấy";
        },
        filterByStatus() {
            this.currentPage = 1; // Reset về trang đầu khi thay đổi trạng thái lọc
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
    },
    mounted() {
        this.retrieveBooks();
        this.retrieveReaders();
    },
};
</script>

<style scoped>
.page {
    text-align: left;
}

.text-danger {
    text-align: center;
}

.btn-success {
    background-color: #a3a09b;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-success:hover {
    background-color: #7f7d79;
}

.btn-warning {
    background-color: #ffc107;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-warning:hover {
    background-color: #e0a800;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-danger:hover {
    background-color: #c82333;
}

.text-name {
    text-decoration: underline;
    color: #7f7d79;
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

td:nth-child(2) { /* Cột Độc giả */
    text-align: center;
    width: 20%; /* Giảm độ rộng của cột Độc giả */
}

td:nth-child(3) { /* Cột Tên sách */
    width: 30%; /* Tăng độ rộng của cột Tên sách */
}
</style>
