const mongoose = require('mongoose')
const db = require('../config/key').mongoUrlURI
const urls = mongoose.createConnection(db, { useNewUrlParser:true,useUnifiedTopology: true })
module.exports = urls
