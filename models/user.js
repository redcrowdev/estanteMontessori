//File Requirements
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Activity = require('./activity.js');
const Review = require('./review.js');
const Child = require('./child.js');
const Session = require('./session.js');
const Parent = require('./parent.js');
// const Tool = require('./tool.js');

//User Schema
const UserSchema = new Schema({
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
   },
   activities: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Activity'
      }
   ],
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
      }
   ],
   children: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Child'
      }
   ],
   sessions: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Session'
      }
   ],
   parents: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Parent'
      }
   ],
   // tools: [
   //    {
   //       type: Schema.Types.ObjectId,
   //       ref: 'Tool'
   //    }
   // ]
});

UserSchema.post('findOneAndDelete', async function (doc) {
   if (doc) {
      await Activity.deleteMany({
         _id: {
            $in: doc.activities
         }
      });
      await Review.deleteMany({
         _id: {
            $in: doc.reviews
         }
      });
      await Child.deleteMany({
         _id: {
            $in: doc.children
         }
      });
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
      // await Tool.deleteMany({
      //    _id: {
      //       $in: doc.tools
      //    }
      // });
   }
})

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

//"Compile" the Schema
const User = mongoose.model('User', UserSchema);

//Export module to be used elsewhere
module.exports = User;