import { User, Subscription, Plan } from '../../model/index.js';

export const allUserSubscription = async (req, res, next) => {
  try {
    let user_subs = await Subscription.findAll({
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "phone", "email"],
        },
        {
          model: Plan,
          attributes: ["name", "amount"], 
        },
      ],
    });
    return res.status(200).json({ user_sub: user_subs });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    console.error('Error fetching user subscriptions:', error); 
    return next(error);
  }
};
