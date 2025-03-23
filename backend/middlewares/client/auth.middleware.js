const Reader = require('../../models/reader.model')

module.exports.authRequire = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        return res.redirect('http://localhost:3001/auth/login');
    }

    const user = await Reader.findOne({
        token: req.cookies.tokenUser
    })

    if (!user) {
        if (req.cookies.tokenUser) {
            res.clearCookie("tokenUser")
            return res.redirect('http://localhost:3001/auth/login');
        }
        return res.redirect('http://localhost:3001/auth/login')
    }
    next();
}