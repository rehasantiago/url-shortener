const mongoose = require('mongoose');

const urlShortener = require('../connections/index')

const Schema = mongoose.Schema;

const UrlSchema =  new Schema({
    originalUrl: String,
    urlCode: String,
    shortUrl: String,
    createdAt: { type: Date, default: Date.now },
    noOfClicks: { type: Number, default: 0}
})

module.exports = Url = urlShortener.model("urls", UrlSchema)
