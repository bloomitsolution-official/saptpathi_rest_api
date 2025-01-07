
import { validationErrorHandler } from '../../helper/validation-error-handler.js';
import {
  User,
  UserDetails,
  Review,

} from '../../model/index.js';

export const addReview = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    // Extract token from headers
    const userId = req.userId;

    const { reviewText, reviewerRole, starRating } = req.body;

    // Fetch the user and their details
    const userExists = await User.findByPk(userId, {
      include: [
        {
          model: UserDetails,
          as: 'details',
          attributes: ['profilePhoto'],
        },
      ],
    });

    if (!userExists) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    const reviewerProfilePic = userExists.details
      ? userExists.details.profilePhoto
      : null;
    const name = userExists.firstName;

    let reviewData = await Review.findOne({ where: { userId } });

    if (reviewData) {
      // Update existing review
      reviewData.reviewText = reviewText;
      reviewData.reviewerName = name; // Use name from User
      reviewData.reviewerProfilePic = reviewerProfilePic; // Use profile picture from UserDetails
      reviewData.reviewerRole = reviewerRole;
      reviewData.starRating = starRating;
      await reviewData.save();

      return res.status(200).json({
        reviewData: reviewData,
        message: 'Review updated successfully 😊',
      });
    } else {
      // Create new review
      reviewData = await Review.create({
        reviewText,
        reviewerName: name,
        reviewerProfilePic,
        reviewerRole,
        starRating,
        userId,
      });

      return res.status(201).json({
        reviewData: reviewData,
        message: 'Review submitted successfully 😊',
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const listReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User, 
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: UserDetails,
              as: 'details',
              attributes: ['profilePhoto'],
            },
          ]
        },
      ],
});

    return res.status(200).json({
      reviews: reviews,
      message: 'Reviews fetched successfully 😊',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
