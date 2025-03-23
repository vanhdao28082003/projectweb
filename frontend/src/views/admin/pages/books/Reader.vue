<template>
    <div>
        <AppHeader />
        <div class="container mt-3">
            <div class="page row">
                <div class="col-md-10">
                    <InputSearch v-model="searchText" />
                </div>
                <div class="mt-3 col-8">
                    <h4>Danh Sách Độc Giả
                        <i class="fa-solid fa-user"></i>
                    </h4>
                    <div class="item">
                        <button class="btn btn-sm btn-primary custom-margin" @click="refreshList()">
                            <i class="fas fa-redo"></i> Làm mới
                        </button>
                    </div>
                    <ReaderList 
                        v-if="filteredReadersCount > 0" 
                        :readers="paginatedReaders" 
                        v-model:activeIndex="activeIndex" 
                    />
                    <p v-else>Không có độc giả nào.</p>

                    <!-- Phân trang -->
                    <div v-if="totalPages > 1" class="pagination-container">
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
                    <div v-if="activeReader">
                        <h4>Chi tiết Độc Giả
                            <i class="fa-solid fa-user"></i>
                        </h4>
                        <ReaderDetail :reader="activeReader" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from '@/components/admin/AppHeader.vue';
import InputSearch from '@/components/admin/InputSearch.vue';
import ReaderList from '@/components/admin/ReaderList.vue';
import ReaderDetail from '@/components/admin/ReaderDetail.vue';
import ReaderService from "@/services/admin/reader.service";

export default {
    components: {
        ReaderDetail,
        InputSearch,
        ReaderList,
        AppHeader,
    },
    data() {
        return {
            readers: [],
            activeIndex: -1,
            searchText: "",
            currentPage: 1,
            itemsPerPage: 3,  // Number of readers per page
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1; // Reset active index when searching
            this.currentPage = 1;  // Reset page when searching
        },
    },
    computed: {
        readersStrings() {
            return this.readers.map((reader) => {
                const { 
                    fullName, 
                    email, 
                    phone, 
                    address 
                } = reader;
                return [
                    fullName, 
                    email, 
                    phone, 
                    address
                ].join("");
            });
        },
        filteredReaders() {
            if (!this.searchText) return this.readers;
            return this.readers.filter((_reader, index) =>
                this.readersStrings[index].includes(this.searchText)
            );
        },
        filteredReadersCount() {
            return this.filteredReaders.length;
        },
        totalPages() {
            return Math.ceil(this.filteredReadersCount / this.itemsPerPage);
        },
        paginatedReaders() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = this.currentPage * this.itemsPerPage;
            return this.filteredReaders.slice(start, end);
        },
        activeReader() {
            return this.activeIndex < 0 ? null : this.paginatedReaders[this.activeIndex];
        }
    },
    methods: {
        async retrieveReaders() {
            try {
                this.readers = await ReaderService.getAllUsers();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveReaders();
            this.searchText = "";
            this.activeIndex = -1;
            this.currentPage = 1;  // Reset page when refreshing
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

.item {
    padding-bottom: 10px;
}

.pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.pagination-container button {
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

.pagination-container button:disabled {
    background-color: #e9ecef;
    border-color: #ddd;
    color: #6c757d;
    cursor: not-allowed;
}

.pagination-container button:hover:not(:disabled) {
    background-color: #007bff;
    color: white;
}

.pagination-container button:active {
    background-color: #0056b3;
    border-color: #0056b3;
    color: white;
}

.pagination-container span {
    font-size: 16px;
    color: #495057;
    margin: 0 10px;
}
</style>
