<template>
  <div>
    <ClientAppHeader />
    <div class="container mt-3">
      <div class="page row">
        <!-- Phần dưới: Các button và Tìm kiếm -->
        <div class="col-md-12">
          <div class="item row mt-3 justify-content-center">
            <div class="col-12 col-md-4">
              <div class="input-group">
                <input
                  type="text"
                  v-model="searchText"
                  class="form-control"
                  placeholder="Nhập từ khóa"
                />
                <button class="btn btn-warning" @click="searchBooks">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
            <!-- Phần chọn sắp xếp theo giá -->
            <div
              class="col-12 col-md-3 d-flex align-items-center gap-3 mt-2 mt-md-0"
            >
              <label for="sortOrder" class="mb-0">Sắp xếp theo: </label>
              <div class="price-filter">
                <select
                  v-model="sortOrder"
                  class="form-control sort-select"
                  @change="sortBooks"
                >
                  <option value="none">Giá</option>
                  <option value="asc">Giá tăng dần</option>
                  <option value="desc">Giá giảm dần</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- Danh sách sách -->
        <div class="col-md-12 mt-3">
          <div class="mt-3 col-12">
            <ClientBookList v-if="filteredBooksCount > 0" :books="paginatedBooks" v-model:activeIndex="activeIndex" />
            <p v-else>Không có sách trong kho.</p>
          </div>

          <!-- Phân trang -->
          <div class="pagination-container mt-4 mb-5">
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

        <!-- Overlay và phần chi tiết sách -->
        <div v-if="activeBook" class="overlay-container">
          <div class="overlay" @click="closeOverlay"></div>
          <div class="book-details-container">
            <div>
              <h4>
                Chi tiết đầu sách
                <i class="fa-solid fa-book"></i>
              </h4>
              <ClientBookDetail :book="activeBook" />
              <router-link :to="{ name: 'borrow-book', params: { id: activeBook._id }}">
                <span class="btn btn-borrow">
                  <i class="fas fa-edit"></i> Mượn sách
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ClientFooter />
  </div>
</template>

<script>
import ClientBookDetail from "@/components/client/ClientBookDetail.vue";
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import ClientFooter from "@/components/client/ClientFooter.vue";
import ClientBookList from "@/components/client/ClientBookList.vue";
import BookService from "@/services/client/book.service";

export default {
  components: {
    ClientBookDetail,
    ClientBookList,
    ClientAppHeader,
    ClientFooter,
  },
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
      currentPage: 1,
      booksPerPage: 10,
      sortOrder: "none",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
      this.currentPage = 1;
    },
  },
  computed: {
    filteredBooks() {
      if (!this.searchText) return this.books;
      return this.books.filter(book => 
        Object.values(book)
          .join('') 
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    },
    activeBook() {
      return this.activeIndex >= 0 && this.activeIndex < this.paginatedBooks.length 
        ? this.paginatedBooks[this.activeIndex] 
        : null;
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    },
    sortedBooks() {
      let booksToDisplay = [...this.filteredBooks];

      if (this.sortOrder === "asc") {
        booksToDisplay = booksToDisplay.sort((a, b) => a.price - b.price);
      } else if (this.sortOrder === "desc") {
        booksToDisplay = booksToDisplay.sort((a, b) => b.price - a.price);
      }

      return booksToDisplay;
    },
    totalPages() {
      return Math.ceil(this.filteredBooksCount / this.booksPerPage);
    },
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.booksPerPage;
      return this.sortedBooks.slice(startIndex, startIndex + this.booksPerPage);
    },
  },
  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.error("Error retrieving books:", error);
      }
    },
    async refreshList() {
      await this.retrieveBooks();
      this.searchText = "";
      this.activeIndex = -1;
    },
    closeOverlay() {
      this.activeIndex = -1;
    },
    goToAddBook() {
      this.$router.push({ name: "book.add" });
    },
    goToPage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages) return;
      this.currentPage = pageNumber;
      this.activeIndex = -1;  // Reset activeIndex khi chuyển trang
    },
    sortBooks() {
      if (this.sortOrder !== "none") {
        this.currentPage = 1;
      }
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
}

.custom-margin {
  margin-right: 10px;
}

.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s ease;
}

.book-details-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  width: 80%;
  max-width: 500px;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.book-details-container h4 {
  margin-bottom: 20px;
  font-size: 1.2em;
}

.book-details-container .btn-borrow {
  font-size: 16px;
  background-color: #d0011b;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
}

.book-details-container .btn-borrow:hover {
  background-color: #c90018;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.pagination-container button {
  margin: 0 5px;
}

.pagination-container button:disabled {
  background-color: #f2f2f2;
}

.pagination-container button i {
  font-size: 18px;
}

.books-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.book-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.book-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.book-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.book-item .book-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}

.book-item .book-author,
.book-item .book-price {
  font-size: 14px;
  color: #777;
}

.sort-select {
  border-radius: 8px;
  padding: 5px;
}

.sort-select option {
  padding: 5px;
}
</style>
