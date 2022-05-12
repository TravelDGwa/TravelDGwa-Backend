const mongoose = require('mongoose')

var blogSchema = mongoose.Schema({
    authorId : {
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    image: [
        {
            type:String
        }
    ],
    topic : String,
    location : String,
    desc: String,
    image: [
        {
            type:String
        }
    ],
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    date:String
})

module.exports = mongoose.model('Blog',blogSchema)