const mongoose = require('mongoose');
const User = require("./user.js")
const Schema = mongoose.Schema;

const ParentSchema = new Schema({
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   birth: {
      type: Date,
      required: true
   },
   gender: {
      type: String,
      required: true,
      enum: ['Masculino', 'Feminino']
   },
   rg: {
      type: String,
      required: true
   },
   cpf: {
      type: String,
      required: true
   },
   phoneNumber: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   picture: {
      type: String,
      default: 'play_time.svg'
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
})

const Parent = mongoose.model('Parent', ParentSchema);
module.exports = Parent;