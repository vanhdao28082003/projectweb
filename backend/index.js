const express = require('express')
const path = require('path')
const cors = require('cors')
const moment = require('moment')
const cookieParser = require('cookie-parser');
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

require('dotenv').config()

// Kết nối CSDL
const database = require('./config/database')
database.connect();

const adminRoute = require('./routes/admin/index.route')
const clientRoute = require('./routes/client/index.route')
const systemPrefix = require('./config/system')

const app = express()
const port = process.env.PORT

// Middleware phân tích và xử lý cookie từ các request của người dùng
app.use(cookieParser('KWJFKWEIFHW'))
// Quản lý session
app.use(session({cookie: {maxAge: 60000}})) // 60000ms = 1phut

app.use(express.static('public'))
// Ghi đè method bằng query parameter "_method"
app.use(methodOverride('_method')); 
// Cho phép CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

// Phục vụ (serve) các tệp tin cần thiết cho trình soạn thảo văn bản WYSIWYG TinyMCE từ thư mục node_modules.
app.use('/tinymce', express.static(path.join(__dirname, "node_modules", "tinymce")))

// Variables
app.locals.adminPrefix = systemPrefix.adminPrefix
app.locals.moment = moment

// Routes
adminRoute(app)
clientRoute(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})