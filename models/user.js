//File Requirements
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


//User Schema
const userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true
   },
   isAdmin: {
      type: Boolean,
      required: true,
      default: false
   },
   googleId: {
      type: String
   }
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//"Compile" the Schema
const User = mongoose.model('User', userSchema);

//Export module to be used elsewhere
module.exports = User;