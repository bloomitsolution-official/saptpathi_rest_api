import {
  User,
  Subscription,
  UserDetails,
  Plan,
  MatchRequest,
} from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';
export const getUserDetails = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    // Fetch user details
    const user = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'isActive'],
      include: [
        {
          model: Subscription,
          as: 'currentPlan',
          include: [
            {
              model: Plan,
            },
          ],
        },
        {
          model: UserDetails,
          as: 'details',
          attributes: [
            'id',
            'name',
            'gender',
            'profilePhoto',
            'age',
            'lookingFor',
          ],
        },
        {
          model: MatchRequest,
          as: 'ReceivedMatchRequests',
          include: [
            {
              model: User,
              as: 'fromUser',
              attributes: [
                'id',
                'firstName',
                'lastName',
                'gender',
                'phone',
                'email',
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while fetching the profile.',
      error: error.message,
    });
  }
};
