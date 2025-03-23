<template>
  <div class="book-grid">
    <div
      class="book"
      v-for="(book, index) in books"
      :key="book._id"
      :class="{ active: index === activeIndex }"
      @click="updateActiveIndex(index)"
    >
      <img :src="'/api/uploads/' + book.thumbnail" alt="Book Image" />
      <div class="book-details">
        <p class="book-title">{{ truncate(book.bookTitle) }}</p>
        <p class="author">{{ book.author }}</p>
        <p class="price">{{ book.price ? book.price.toLocaleString() + ' VNĐ' : 'N/A' }}</p>      
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    books: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
    truncate(text, length = 20) {
      if (text.length > length) {
        return text.substring(0, length) + '...';
      }
      return text;
    },
  }
};
</script>

<style>
.book-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.book {
  flex-basis: 18%;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
  background-color: #fff;
}

.book:hover {
  transform: translateY(-10px);
}

.book img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
}

.book-details {
  text-align: center;
  margin-top: 10px;
}

.book-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}

.author {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #e91e63;
  margin-top: 10px;
}
</style>
