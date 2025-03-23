<template>
    <ul class="list-group">
        <li class="list-group-item" 
            v-for="(book, index) in books" 
            :key ="book._id"
            :class="{active: index === activeIndex}"
            @click = "updateActiveIndex(index)"
        >
            {{ book.bookTitle }}
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        books: { type: Array, default: [] },
        activeIndex: {type: Number, default: -1},
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        }
    }
}
</script>