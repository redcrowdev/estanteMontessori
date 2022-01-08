//File Requirements
const mongoose = require('mongoose')

//User Schema
const userSchema = new mongoose.Schema({
   userName: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   email: {
      type: String,
      lowercase: true,
      required: true
   },
   isAdmin: {
      type: Boolean,
      required: true,
      default: false
   }
})

//"Compile" the Schema
const User = mongoose.model('User', userSchema);

//Export module to be used elsewhere
module.exports = User;