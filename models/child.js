//File Requirements
const mongoose = require('mongoose')
const Session = require('./session')
const Parent = require('./parent.js');
const Schema = mongoose.Schema;

//Local variables
const gender = ['Feminino', 'Masculino']

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
      url: {
         type: String,
         default: 'public/img/toy_car.svg'
      },
      fileName: {
         type: String
      }
   },
   parents: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Parent'
      }
   ],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
      });
      await Parent.deleteMany({
         _id: {
            $in: doc.parents
         }
      });
   }
})

//"Compile" Schema
const Child = mongoose.model('Child', ChildSchema);

//Export module to be used elsewhere
module.exports = Child;