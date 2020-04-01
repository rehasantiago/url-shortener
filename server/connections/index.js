const mongoose = require('mongoose')
const db = require('../config/key').mongoUrlShortenerURI
const urlShortener = mongoose.createConnection(db, { useNewUrlParser:true,useUnifiedTopology: true })
module.exports = urlShortener
