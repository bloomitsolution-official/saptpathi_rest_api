import { User, Subscription, Plan } from '../../model/index.js';

export const listSubscriptions = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const Subscriptions = await Subscription.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'phone', 'email', 'memberId'],
        },
        {
          model: Plan,
          attributes: ['name', 'amount'],
        },
      ],
    });

    return res.status(200).json(Subscriptions);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const updateSubscriptions = async (req, res, next) => {
  const { planId, status } = req.body;

  try {
    if (!status) {
      const error = new Error("Validation Failed! Status Can't be empty.");
      error.statusCode = 401;
      return next(error);
    }
    const usersPlan = await Subscription.findOne({
      where: { userId: req.params.userId },
      include: [
        {
          model: User,
          attributes: ['firstName', 'phone', 'email'],
        },
      ],
    });
    if (!usersPlan) {
      const error = new Error('User Plan details not found.');
      error.statusCode = 404;
      return next(error);
    }
    if (usersPlan?.status === status) {
      const error = new Error(`User Plan with ${status} already updated`);
      error.statusCode = 400;
      return next(error);
    }
    if (status === 'Approved' || status === 'Rejected') {
      const planDetails = await Plan.findByPk(usersPlan?.planId);

      // Update the user based on the status
      if (status === 'Approved') {
        await User.update(
          {
            isActive: true,
          },
          { where: { id: usersPlan?.userId } },
        );

        // await assignUserBenefits(userId,planId);
      } else if (status === 'Rejected') {
        await User.update(
          {
            isActive: false,
          },
          { where: { id: usersPlan?.userId } },
        );
      }

      // Update the usersPlan status
      await usersPlan.update({ status });
    }
    return res.status(201).json({ message: 'User Plan Status Updated!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

