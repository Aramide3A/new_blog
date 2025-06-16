const mongoose = require('mongoose')

const schema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    first_name : {
        type: String,
        required: true
    },
    last_name : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
})

const userSchema = mongoose.model('User', schema)

module.exports = userSchema