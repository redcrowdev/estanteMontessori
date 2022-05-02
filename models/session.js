const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
   title: {
      type: String
   },
   date: {
      type: Date
   },
   body: {
      type: String
   },
   sessionType: {
      type: String,
      trim: true
   },
   focusArea: {
      type: String,
      trim: true
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
})

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;