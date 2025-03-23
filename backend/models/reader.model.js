const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const readerSchema = new mongoose.Schema({
    fullName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    token: String,
    address: String,
    phone: {
        type: String,
        required: true,
        unique: true
    },
    borrow: [
        {
            id_book: String,
            status: {
                type:String,
                default: "processing" //processing accepted refused returned
            },
            borrowDate: String,
            returnDate: String,
            quantity: {
                type: Number,
                default: 1,
                require: true,
            },
            initialQuantity: {
                type: Number,
                default: 1,
                require: true,
            },
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
},
    { timestamps: true }
)

const Reader = mongoose.model("Reader", readerSchema, "docgia");

module.exports = Reader;