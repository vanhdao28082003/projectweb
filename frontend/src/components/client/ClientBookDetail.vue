<template>
  <div>
    <hr />
    <div class="p-1">
      <strong>Tên sách:</strong>
      {{ book.bookTitle }}
    </div>
    <div class="p-1">
      <img class="center-image" width="150px" height="200px" :src="'/api/uploads/' + book.thumbnail" alt="Hình sách"
        style="max-width: 100%;" />
    </div>
    <div class="p-1">
      <strong>Giá: </strong>
      {{ book.price }}
    </div>
    <div class="p-1">
      <strong>Số lượng trong kho: </strong>
      {{ book.quantity }}
    </div>
    <div class="p-1">
      <strong>Số lượng còn lại: </strong>
      {{ remain }}
    </div>
    <div class="p-1">
      <strong>Tác giả:</strong>
      {{ book.author }}
    </div>
    <hr />
    <div class="p-1">
      <strong>Tên nhà xuất bản:</strong>
      {{ book.publisherName }}
    </div>
    <div class="p-1">
      <strong>Năm xuất bản:</strong>
      {{ book.publishYear }}
    </div>
  </div>
</template>

<script>
import ReaderService from "@/services/client/reader.service";

export default {
  props: {
    book: { type: Object, required: true },
  },
  data() {
    return {
      formData: {
        quantity: 1,
        borrowDate: "",
        returnDate: "",
        book_id: this.book._id,
      },
      remain: 0,
    };
  },
  methods: {
    async updateremain() {
      try {
        const response = await ReaderService.getNumberBookBorrowed(this.book._id);
        this.remain = this.book.quantity - response;
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Error!";
        toast.error(errorMessage, { autoClose: 3000 });
      }
    },
  },
  watch: {
    // Giám sát sự thay đổi của prop 'book'
    book: {
      handler() {
        // Gọi phương thức updateremain() mỗi khi prop 'book' thay đổi
        this.updateremain();
      },
      deep: true, // Giám sát sâu vào các thuộc tính của 'book'
    },
  },
  mounted() {
    this.updateremain();
  },
};
</script>

<style>
.center-image {
  display: block;
  margin: 0 auto;
}
</style>