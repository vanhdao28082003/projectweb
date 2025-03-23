<template>
    <AppHeader />
    <div class="page">
        <h4>Thêm sách <i class="fa-solid fa-book"></i></h4>
        <BookForm :book="formData" :isEditMode="false" @submit:book="createBook" class="form-container" />
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
    data() {
        return {
            formData: {
                id_publisher: "",
                bookTitle: "",
                price: 0,
                quantity: 0,
                thumbnail: null,
                publishYear: "",
                author: "",
            },
            imageChanged: false,
            message: "", // Define message here
        };
    },
    methods: {
        async createBook(data) {
            if (confirm("Bạn muốn thêm cuốn sách này?")) {
                try {
                    // If the image is uploaded, add it to the formData
                    if (this.imageChanged) {
                        data.thumbnail = this.formData.thumbnail;
                    }
                    await BookService.create(data);

                    // Show success toast
                    toast.success("Book was created successfully!", {
                        autoClose: 1200,
                    });

                    // Wait for the toast to finish and then redirect
                    setTimeout(() => {
                        this.$router.push("/admin/books");
                    }, 1200); // match the autoClose duration of toast
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to create the book.", {
                        autoClose: 1200,
                    });
                }
            }
        },
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