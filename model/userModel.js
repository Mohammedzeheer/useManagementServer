const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String,  required: [true, "Username Required"],unique: true},
    password: {type: String, required: [true, "Password Required"]}, 
    image:    {type: String}
})

module.exports = mongoose.model('Users', userSchema)