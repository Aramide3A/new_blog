const mongoose = require('mongoose')

const schema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    body: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    tags: {
        type: String,
    }
})

const postSchema = mongoose.model('Post', schema)

module.exports = postSchema