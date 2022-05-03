const Activity = require('../models/activity');
const Child = require('../models/child');
const Parent = require('../models/parent');
const Review = require('../models/review');
const Session = require('../models/session');
const Tool = require('../models/tool');
const User = require('../models/user');


module.exports.show = async (req, res, next) => {
   const activities = await Activity.find({});
   const children = await Child.find({});
   const parents = await Parent.find({});
   const reviews = await Review.find({});
   const sessions = await Session.find({});
   const users = await User.find({});
   const tools = await Tool.find({});
   const topUserActivities = await User.find({}).sort({ activities: -1 }).limit(1).populate({ path: 'activities' });
   const topUserRewiews = await User.find({}).sort({ reviews: -1 }).limit(1).populate({ path: 'reviews' });
   const topUserSessions = await User.find({}).sort({ sessions: -1 }).limit(1).populate({ path: 'sessions' });
   const topReviewsActivity = await Activity.find({}).sort({ reviews: -1 }).limit(1).populate({ path: 'reviews' });
   const topSessionsChild = await Child.find({}).sort({ sessions: -1 }).limit(1).populate({ path: 'sessions' });
   res.render('metrics/indicadores', { activities, children, parents, reviews, sessions, users, tools, topUserActivities, topUserRewiews, topUserSessions, topReviewsActivity, topSessionsChild })
}