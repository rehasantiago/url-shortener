const mongoose = require('mongoose');

const urls = require('../connections/index')

const Schema = mongoose.Schema;

const UserSchema =  new Schema({
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
    urls: [{ type: Schema.Types.ObjectId, ref: 'urls' }]
})

module.exports = User = urls.model("users", UserSchema)
