const bcrypt = require('bcrypt');
const Account = require('../../models/employee.model')
const ApiError = require('../../helpers/api-error')

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res, next) => {
    try {
        const enteredEmail = req.body.email;
        const enteredPassword = req.body.password;

        // Kiểm tra nếu email hoặc mật khẩu không được nhập
        if (!enteredEmail || !enteredPassword) {
            return res.json('wrong info');
        }

        // Tìm người dùng theo email
        const user = await Account.findOne({ email: enteredEmail });

        if (!user) {
            return res.json('wrong info');
        }

        // So sánh mật khẩu đã nhập với mật khẩu đã băm trong cơ sở dữ liệu
        const isPasswordValid = await bcrypt.compare(enteredPassword, user.password);

        if (!isPasswordValid) {
            return res.json('wrong info');
        }

        // Nếu mật khẩu hợp lệ, tạo token và trả về phản hồi thành công
        res.cookie("token", user.token); // Thêm tính năng bảo mật cookie nếu cần
        return res.json('success');
        
    } catch (error) {
        console.log('Error:', error);
        return next(new ApiError(500, error));
    }
};


// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.send({
        success: true
    })
}