<template>
    <Form 
    @submit="submitBook" 
    :validation-schema="bookFormSchema"
    >
        <div class="form-group">
            <label for="bookTitle">Tên sách</label>
            <Field 
            name="bookTitle" 
            type="text" 
            class="form-control" 
            v-model="bookLocal.bookTitle" 
            />
            <ErrorMessage name="bookTitle" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="price">Giá</label>
            <Field 
            name="price" 
            type="number" 
            class="form-control" 
            v-model="bookLocal.price" 
            />
            <ErrorMessage name="price" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="quantity">Số lượng</label>
            <Field 
            name="quantity" 
            type="number" 
            class="form-control" 
            v-model="bookLocal.quantity" 
            />
            <ErrorMessage name="quantity" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="author">Tác giả</label>
            <Field 
            name="author" 
            type="text" 
            class="form-control" 
            v-model="bookLocal.author" 
            />
            <ErrorMessage name="author" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="publisherName">Tên nhà xuất bản</label>
            <Field 
            name="publisherName" 
            type="text" 
            class="form-control" 
            v-model="bookLocal.publisherName" 
            />
            <ErrorMessage name="publisherName" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="publishYear">Năm xuất bản</label>
            <Field 
            name="publishYear" 
            type="text" 
            class="form-control" 
            v-model="bookLocal.publishYear" 
            />
            <ErrorMessage name="publishYear" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="thumbnail">Ảnh</label>

            <!-- Conditionally display the image only in edit mode -->
            <img v-if="isEditMode && book.thumbnail"
            class="center-image"
            width="150px"
            height="200px"
            :src="'/api/uploads/' + book.thumbnail"
            alt="Hình sách"
            style="max-width: 100%;"
            />

            <div class="custom-file-input">
            <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                class="form-control-file"
                @change="handleThumbnailChange"
            />
            </div>
            <ErrorMessage name="thumbnail" class="error-feedback" />
        </div>

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button 
            v-if="bookLocal._id" 
            type="button" 
            class="ml-2 btn btn-danger" 
            @click="deleteBook"
            >
                Xóa
            </button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:book", "delete:book"],
    props: {
        book: { type: Object, required: true },
        isEditMode: {
            type: Boolean,
            default: false, // Default is false for CreateBook
        },
    },
    data() {
        const bookFormSchema = yup.object().shape({
            bookTitle: yup
                .string()
                .required("Tên sách phải có giá trị.")
                .min(2, "Tên sách phải ít nhất 2 ký tự.")
                .max(50, "Tên sách có nhiều nhất 50 ký tự."),
            price: yup
                .number()
                .required("Giá phải có giá trị.")
                .min(1, "Giá không được nhỏ hơn 1."),
            quantity: yup
                .number()
                .required("Số lượng phải có giá trị.")
                .min(1, "Số lượng không được nhỏ hơn 1."),
            author: yup
                .string()
                .max(50, "Tác giả có nhiều nhất 50 ký tự."),
            publisherName: yup
                .string()
                .max(50, "Tên nhà xuất bản tối đa 50 ký tự."),
            publishYear: yup
                .string()
                .max(4, "Năm xuất bản không hợp lệ."),
        });
        return {
            // Use bookLocal to avoid directly mutating props
            bookLocal: { ...this.book },
            bookFormSchema,
        };
    },
    methods: {
        handleThumbnailChange(event) {
            const file = event.target.files[0];
            this.bookLocal.thumbnail = file;  // store the uploaded file in bookLocal
        },
        submitBook() {
            this.$emit("submit:book", this.bookLocal);
        },
        deleteBook() {
            this.$emit("delete:book", this.bookLocal._id);
        },
    },
};
</script>

<style scoped>
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

.btn {
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
    box-shadow: 0 4px 6px rgba(0, 123, 255, 0.4);
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #c82333;
    box-shadow: 0 4px 6px rgba(220, 53, 69, 0.4);
}

.ml-2 {
    margin-left: 10px;
}

.form-container {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
}

@media (max-width: 768px) {
    .form-container {
        padding: 20px;
    }

    .btn {
        width: 100%;
        margin-bottom: 10px;
    }

    .ml-2 {
        margin-left: 0;
    }
}

</style>