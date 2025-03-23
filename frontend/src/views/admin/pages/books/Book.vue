<template>
    <div>
        <AppHeader />
        <div class="container mt-3">
            <div class="page row">
                <div class="col-md-10">
                    <InputSearch v-model="searchText" />
                </div>
                <div class="mt-3 col-8">
                    <h4>Danh sách sách trong kho <i class="fa-solid fa-book"></i></h4>
                    <div class="item">
                        <button class="btn btn-sm btn-primary custom-margin" @click="refreshList()">
                            <i class="fas fa-redo"></i> Làm mới
                        </button>
                        <button class="btn btn-sm btn-success custom-margin" @click="goToAddBook">
                            <i class="fas fa-plus"></i> Thêm mới
                        </button>
                        <button class="btn btn-sm btn-danger custom-margin" @click="removeAllBooks">
                            <i class="fas fa-trash"></i> Xóa tất cả
                        </button>
                    </div>
                    <BookList 
                        v-if="filteredBooksCount > 0" 
                        :books="paginatedBooks" 
                        v-model:activeIndex="activeIndex" 
                    />
                    <p v-else>Không có cuốn sách nào.</p>

                    <!-- Phân trang -->
                    <div v-if="totalPages > 1" class="pagination">
                        <button class="btn btn-sm btn-light" @click="previousPage" :disabled="currentPage === 1">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="mx-2">Trang {{ currentPage }} / {{ totalPages }}</span>
                        <button class="btn btn-sm btn-light" @click="nextPage" :disabled="currentPage === totalPages">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-3 col-4">
                    <div v-if="activeBook">
                        <h4>Chi tiết đầu sách <i class="fa-solid fa-book"></i></h4>
                        <BookDetail :book="activeBook" />
                        <router-link :to="{
                            name: 'book.edit',
                            params: { id: activeBook._id },
                        }">
                            <span class="mt-2 badge badge-warning" style="color: blue">
                                <i class="fas fa-edit"></i> Hiệu chỉnh
                            </span>
                        </router-link>
                        <span class="mt-2 badge badge-warning" style="color:red; cursor: pointer;" @click="removeOneBook(activeBook)">
                            <i class="fa-solid fa-trash"></i> Xóa
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import AppHeader from '@/components/admin/AppHeader.vue';
import InputSearch from '@/components/admin/InputSearch.vue';
import BookList from '@/components/admin/BookList.vue';
import BookDetail from '@/components/admin/BookDetail.vue';
import BookService from "@/services/admin/book.service";

export default {
    components: {
        AppHeader,
        InputSearch,
        BookList,
        BookDetail,
    },
    data() {
        return {
            books: [],
            activeIndex: -1,
            searchText: "",
            currentPage: 1,
            itemsPerPage: 5, // Số lượng sách mỗi trang
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1; // Reset activeIndex khi tìm kiếm
            this.currentPage = 1;  // Reset trang khi tìm kiếm
        }
    },
    computed: {
        booksStrings() {
            return this.books.map((book) => {
                const { bookTitle, price, quantity, publishYear, author, thumbnail } = book;
                return [bookTitle, price, quantity, publishYear, author, thumbnail].join("");
            });
        },
        filteredBooks() {
            if (!this.searchText) return this.books;
            return this.books.filter((_book, index) => this.booksStrings[index].includes(this.searchText));
        },
        filteredBooksCount() {
            return this.filteredBooks.length;
        },
        totalPages() {
            return Math.ceil(this.filteredBooksCount / this.itemsPerPage);
        },
        paginatedBooks() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = this.currentPage * this.itemsPerPage;
            return this.filteredBooks.slice(start, end);
        },
        activeBook() {
            return this.activeIndex < 0 ? null : this.paginatedBooks[this.activeIndex];
        }
    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveBooks();
            this.searchText = "";
            this.activeIndex = -1;
            this.currentPage = 1; // Reset trang khi làm mới
        },
        async removeOneBook(book) {
            if (confirm("Bạn muốn xóa cuốn sách này?")) {
                try {
                    await BookService.delete(book._id);
                    toast.success("Book was deleted successfully!", { autoClose: 1200 });
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                    toast.error("Failed to delete the book.", { autoClose: 1200 });
                }
            }
        },
        async removeAllBooks() {
            if (confirm("Bạn muốn xóa tất cả sách ?")) {
                try {
                    await BookService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddBook() {
            this.$router.push({ name: "book.add" });
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        previousPage() {
            if (this.currentPage > 1) this.currentPage--;
        }
    },
    mounted() {
        this.refreshList();
    }
}
</script>

<style scoped>
.page {
    text-align: left;
}

.custom-margin {
    margin-right: 10px;
}

.item {
    padding-bottom: 10px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    padding: 5px 15px;
    border: 1px solid #ddd;
    border-radius: 25px;
    background-color: #f8f9fa;
    color: #495057;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 5px;
}

.pagination button:disabled {
    background-color: #e9ecef;
    border-color: #ddd;
    color: #6c757d;
    cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
    background-color: #007bff;
    color: white;
}

.pagination button:active {
    background-color: #0056b3;
    border-color: #0056b3;
    color: white;
}

.pagination span {
    font-size: 16px;
    color: #495057;
    margin: 0 10px;
}
</style>
