<template>
    <div>
        <hr>
        <div class="p-1">
            <strong>Tên độc giả</strong>
            {{ reader.fullName }}
        </div>
        <div class="p-1">
            <strong>Email: </strong>
            {{ reader.email }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ: </strong>
            {{ reader.address }}
        </div>
        <div class="p-1">
            <strong>Số điện thoại:</strong>
            {{ reader.phone }}
        </div>
        <hr>
         <!-- <div class="p-1">
            <strong>Sách đã mượn:</strong>
            <ul>
                <li v-for="(borrow, index) in reader.borrow" :key="index">
                    <strong>Mã sách:</strong> {{ borrow.id_book }}
                    <br>
                    <strong>Trạng thái:</strong> {{ borrow.status }}
                    <br>
                    <strong>Ngày mượn:</strong> {{ borrow.borrowDate }}
                    <br>
                    <strong>Ngày trả:</strong> {{ borrow.returnDate }}
                    <br>
                    <strong>Số lượng:</strong> {{ borrow.quantity }}
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
export default {
    props: {
        reader: { type: Object, required: true },
    },
};
</script>