import sequelize from '../utilities/database.js';

import User from './User.js';
import Admin from './Admin.js';
import MatchRequest from './MatchRequest.js';
import Plan from './Plan.js';
import Subscription from './Subscription.js';
import Gallery from './Gallary.js';
import Enquire from './Enquire.js';
import ChatMessage from './ChatMessage.js';
import UserDetails from './UserDetails.js';
import Preferences from './Preference.js';
import Review from './Review.js';
import Couples from './Couples.js';
import Banner from './Banner.js';

// User has one current Plan through Subscription
User.hasOne(Subscription, {
  as: 'currentPlan',
  foreignKey: 'userId',
});
Subscription.belongsTo(User, {
  foreignKey: 'userId',
});

// Plan can belong to multiple Users through Subscription
Plan.hasMany(Subscription, {
  as: 'subscriptions',
  foreignKey: 'planId',
});
Subscription.belongsTo(Plan, {
  foreignKey: 'planId',
});

User.hasOne(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

MatchRequest.belongsTo(User, { as: 'fromUser', foreignKey: 'fromUserId' });
MatchRequest.belongsTo(User, { as: 'toUser', foreignKey: 'toUserId' });

User.hasMany(MatchRequest, {
  as: 'SentMatchRequests',
  foreignKey: 'fromUserId',
});
User.hasMany(MatchRequest, {
  as: 'ReceivedMatchRequests',
  foreignKey: 'toUserId',
});

User.hasOne(UserDetails, { as: 'details', foreignKey: 'userId' });
UserDetails.belongsTo(User, { as: 'details', foreignKey: 'userId' });

User.hasOne(Preferences, { foreignKey: 'userId' });
Preferences.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ChatMessage, { foreignKey: 'fromUser', as: 'from' });
User.hasMany(ChatMessage, { foreignKey: 'toUser', as: 'to' });

ChatMessage.belongsTo(User, { foreignKey: 'fromUser', as: 'from' });
ChatMessage.belongsTo(User, { foreignKey: 'toUser', as: 'to' });

sequelize
  .sync({})
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

export {
  User,
  sequelize,
  Admin,
  Couples,
  MatchRequest,
  Plan,
  Review,
  Subscription,
  Enquire,
  Gallery,
  ChatMessage,
  UserDetails,
  Preferences,
  Banner,
};
