const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected databases successfully!')
    } catch (error) {
        console.log('CONNECT ERROR!',error)
    }
}