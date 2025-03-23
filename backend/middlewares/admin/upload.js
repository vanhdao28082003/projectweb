const multer = require('multer')
const path = require('path')

// Định nghĩa nơi lưu trữ và tên tệp
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Đặt thư mục lưu trữ tệp
        callback(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, callback) => {
        // Đặt tên tệp khi lưu, ở đây dùng thời gian để tránh trùng lặp
        const filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

// Kiểm tra xem loại tệp (file type) có được chấp nhận hay không trước khi cho phép tải lên.
const fileFilter = (req, file, callback) => {
    const allowedMimes = ['image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Invalid file type. Only JPEG and PNG images are allowed.'), false);
    }
}

// Giới hạn kích thức file
const limits = {
    fileSize: 1024 * 1024 * 5, // 5MB limit
};

// Khởi tạo multer với cấu hình storage
const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
})

module.exports = upload;