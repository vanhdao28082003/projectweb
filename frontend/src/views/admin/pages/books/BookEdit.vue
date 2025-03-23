<template>
    <AppHeader />
    <div v-if="book" class="page">
        <h4>Hiệu chỉnh đầu sách <i class="fa-solid fa-book"></i></h4>
        <BookForm :book="book" :isEditMode="true" @submit:book="updateBook" @delete:book="deleteBook" class="form-container" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import AppHeader from '@/components/admin/AppHeader.vue';
import BookForm from '@/components/admin/BookForm.vue';
import BookService from '@/services/admin/book.service';

export default {
    components: {
        AppHeader,
        BookForm,
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            info: "Image data is being updated",
            imageChanged: false,
            book: null,
            message: "",
            formData: {
                thumbnail: null,
            },
        };
    },
    methods: {
        async getBook(id) {
            try {
                this.book = await BookService.get(id);
            } catch (error) {
                console.error(error);
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                this.$router.push({
                    name: "notfound",
                    params: {
                        pathMatch: this.$route.path.split("/").slice(1),
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        async updateBook(data) {
            if (confirm("Bạn muốn cập nhật cuốn sách sách này?")) {
                try {
                    // If the image has changed, add it to the formData
                    if (this.imageChanged) {
                        data.thumbnail = this.formData.thumbnail;
                    }
                    await BookService.update(this.book._id, data);

                    // Show success toast
                    toast.success("Book was updated successfully!", {
                        autoClose: 1200,
                    });

                    // Wait for the toast to finish and then redirect
                    setTimeout(() => {
                        this.$router.push("/admin/books");
                    }, 1200); // match the autoClose duration of toast
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to update the book.", {
                        autoClose: 1200,
                    });
                }
            }
        },
        async deleteBook() {
            if (confirm("Bạn muốn xóa sách này?")) {
                try {
                    await BookService.delete(this.book._id);

                    // Show success toast
                    toast.success("Book was deleted successfully!", {
                        autoClose: 1200,
                    });

                    // Wait for the toast to finish and then redirect
                    setTimeout(() => {
                        this.$router.push("/admin/books");
                    }, 1200); // match the autoClose duration of toast
                } catch (error) {
                    console.log(error);
                    toast.error("Failed to delete the book.", {
                        autoClose: 1200,
                    });
                }
            }
        },
    },
    created() {
        this.getBook(this.id);
    },
};
</script>

<style>
h4 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
}

p {
    font-size: 1rem;
    color: #28a745;
    margin-top: 15px;
    text-align: center;
}

button {
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

button:focus {
    outline: none;
}

.btn-primary {
    background-color: #007bff;
    color: #fff;
}

.btn-primary:hover {
    background-color: #0056b3;
    box-shadow: 0 4px 6px rgba(0, 123, 255, 0.4);
}

.btn-danger {
    background-color: #dc3545;
    color: #fff;
}

.btn-danger:hover {
    background-color: #c82333;
    box-shadow: 0 4px 6px rgba(220, 53, 69, 0.4);
}

.form-container {
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    font-weight: bold;
    color: #333;
    font-size: 1.1rem;
}

.form-control {
    width: 100%;
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    transition: border-color 0.2s;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
}

.error-feedback {
    color: red;
    font-size: 0.875em;
    margin-top: 5px;
}
</style>