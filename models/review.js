const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
   title: {
      type: String,
      //required: true
   },
   body: {
      type: String,
      //required: true
   },
   date: {
      type: Date,
      default: Date.now()
      //required: true
   }

})

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;