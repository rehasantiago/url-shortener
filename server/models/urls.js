const mongoose = require('mongoose');
const urls = require('../connections/index')

const Schema = mongoose.Schema;

const UrlSchema =  new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    urls: [{
        originalUrl: String,
        urlCode: String,
        shortUrl: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        noOfClicks: { type: Number, default: 0}
    }]
})

module.exports = Urls = urls.model("urls", UrlSchema)
