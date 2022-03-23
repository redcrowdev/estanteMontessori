//File Requirements
const mongoose = require('mongoose')
const Session = require('./session')
const Schema = mongoose.Schema;

//Local variables
const gender = ['femenino', 'masculino']

//Child Schema
const ChildSchema = new Schema({
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
      //enum limits the options to those inside the array
      enum: gender,
      required: true
   },
   picture: {
      type: String,
      default: 'toy_car.svg'
   },
   sessions: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Session'
      }
   ]
})

ChildSchema.post('findOneAndDelete', async function (doc) {
   if (doc) {
      await Session.deleteMany({
         _id: {
            $in: doc.sessions
         }
      })
   }
})

//"Compile" Schema
const Child = mongoose.model('Child', ChildSchema);

//Export module to be used elsewhere
module.exports = Child;