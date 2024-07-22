const mongoose = require('mongoose')

const schema = mongoose.Schema({
    author : String,
    image : {
        type : String
    },
    title :   {
        type: String,
        required: true
    },
    body :  {
        type: String,
        required: true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    category: {
        type: String,
        enum: ['Automobile', 'Health', 'Technology'],
        required: true
    }
})

const posts = mongoose.model('Post', schema)

module.exports = posts