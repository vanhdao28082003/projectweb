const express = require("express")
const router = express.Router()
const controller = require('../../controllers/admin/employee.controller')

router.get('/infor', controller.getInfor)

router.get('/getReaders', controller.getReaders)

router.put('/statusBook/:readerId/:bookId', controller.statusBook)

router.delete('/borrow/:readerId/:bookId', controller.deleteBorrowedBook);

module.exports = router;