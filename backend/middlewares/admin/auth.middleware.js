const Account = require('../../models/employee.model')

module.exports.authRequire = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect('http://localhost:3001/admin/auth/login')
    }

    const user = await Account.findOne({
        token:req.cookies.token
    })

    if (!user) {
        if (req.cookies.token) {
            res.clearCookie("token")
            return res.redirect('http://localhost:3001/admin/auth/login')
        }
        return res.redirect('http://localhost:3001/admin/auth/login')
    }

    // res.locals.user = user
    next();
}