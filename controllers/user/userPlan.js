import { Subscription, User, Plan } from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
export const userSubscription = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const userId = req.userId;

    const user = await Subscription.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['name', 'phone', 'email'],
        },
        {
          model: Plan,
          attributes: ['name', 'amount'],
        },
      ],
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const createOrder = async paidAmount => {
  try {
    const instance = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });

    const options = {
      amount: paidAmount,
      currency: 'INR',
    };

    return new Promise((resolve, reject) => {
      instance.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export const buyPlan = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { planId, paidAmount, paymentdetails, paymentStatus } = req.body;
  
  try {
    // Extract token from headers
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      const error = new Error('No token provided');
      error.statusCode = 401;
      return next(error);
    }

    // Decode token to get userId
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.TOKEN_SIGNING_KEY);
    } catch (err) {
      err.statusCode = 500;
      return next(err);
    }

    if (!decodedToken) {
      const error = new Error('Failed to authenticate token');
      error.statusCode = 401;
      return next(error);
    }

    const userId = decodedToken.id;

    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      return next(error);
    }

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      const error = new Error('Plan not found!');
      error.statusCode = 404;
      return next(error);
    }

    const userExistingPlan = await Subscription.findOne({
      where: {
        userId,
        planId,
        status: 'Success',
      },
    });

    if (userExistingPlan) {
      const error = new Error('User already subscribed to this plan.');
      error.statusCode = 401;
      return next(error);
    }

    const parsePlanValidity = validityString => {
      const [amount, unit] = validityString.split(' ');
      if (unit.toLowerCase() === 'months') {
        return parseInt(amount, 10);
      }
      throw new Error('Unsupported validity unit');
    };

    // Calculate start and end dates
    const startDate = new Date();
    let endDate = new Date();

    try {
      const monthsToAdd = parsePlanValidity(plan.dataValues.planValidity);
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
    } catch (error) {
      error.statusCode = 400;
      return next(error);
    }

    let status = paymentStatus ? 'Success' : 'Failed';

    // Create a new user plan with updated status
    const SubscriptionDetails = await Subscription.create({
      userId,
      planId,
      status,
      paidAmount,
      paymentdetails,
      startDate,
      endDate,
    });

    // Update or create user benefits with features
    // let userBenefits = await UserBenefits.findOne({
    //   where: { userId, planId },
    // });

    // if (userBenefits) {
    //   userBenefits.features = plan.features;
    //   await userBenefits.save();
    // } else {
    //   await UserBenefits.create({
    //     userId,
    //     planId,
    //     features: plan.features,
    //   });
    // }

    return res.status(201).json({
      message: 'User subscribed to this plan successfully!',
      paymentdetails: paymentdetails,
      status: status, // Return the actual status to the client
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
