import { User, UserDetails } from '../../model/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { MatchRequest, Enquire, Preferences } from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';

export const getFilteredUsers = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const { lookingFor, age, religion, location } = req.body;

    const userConditions = {};

    if (lookingFor) {
      userConditions.lookingFor = lookingFor;
    }
    if (age) {
      const ageRange = age.split('to').map(a => parseInt(a.trim(), 10));
      if (ageRange.length === 2) {
        userConditions.age = { [Op.between]: ageRange };
      }
    }
    if (religion) {
      userConditions.religion = religion;
    }
    if (location) {
      advancedBioConditions.city = location;
    }

    const users = await UserDetails.findAll({
      where: userConditions,
      include: [
        {
          model: AdvancedBio,
          where: advancedBioConditions,
        },
      ],
    });

    res.status(200).json({
      users,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { id, firstName, lastName, email, phone, about, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      const error = new Error(`User with ID ${id} not found`);
      error.statusCode = 404;
      return next(error);
    }

    if (phone && phone !== user.phone) {
      const existingUserWithPhone = await User.findOne({ where: { phone } });
      if (existingUserWithPhone) {
        const error = new Error(
          `User with phone number ${phone} already exists`,
        );
        error.statusCode = 401;
        return next(error);
      }
    }

    if (email && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ where: { email } });
      if (existingUserWithEmail) {
        const error = new Error(`User with email ${email} already exists`);
        error.statusCode = 401;
        return next(error);
      }
    }

    // Hash the new password if it's provided
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user details only if they are provided in the MatchRequest
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (about) user.about = about;
    if (password) user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      user,
      message: 'User profile updated successfully😊',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const addEnquiry = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { fullName, email, phone, subject, message } = req.body;

  try {
    // Create a new enquiry entry
    const newEnquiry = await Enquire.create({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    return res.status(201).json({
      enquiry: newEnquiry,
      message: 'Enquiry submitted successfully😊',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
export const listAllEnquiries = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const enquiries = await Enquire.findAll();

    return res.status(200).json({
      enquiries,
      message: 'Enquiries retrieved successfully',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const deleteInquary = async (req, res, next) => {
  const { id } = req.params;
  try {
    const inquiry = await Enquire.findByPk(id);
    if (!inquiry) {
      const error = new Error('Inquiry not found.');
      error.statusCode = 404;
      throw error;
    }
    await inquiry.destroy();
    return res.status(200).json({
      message: 'Inquiry deleted successfully.',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; 
    }
    return next(error); 
  }
};

export const preference = async (req, res, next) => {
  validationErrorHandler(req, next);
  const {
    Age,
    height,
    maritalStatus,
    motherTongue,
    physicalStatus,
    eatingHabits,
    maxHeight,
    minHeight,
    education,
    minAge,
    maxAge,
    drinkingHabits,
    smokingHabits,
    religion,
    caste,
    subcaste,
    haveDosh,
    star,
    highestEducation,
    occupation,
    annualIncome,
    country,
    ancestralOrigin,
  } = req.body;

  try {
    const userId = req.userId;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if preferences already exist
    let preference = await Preferences.findOne({ where: { userId } });

    if (preference) {
      // Update existing preferences
      await Preferences.update(
        {
          Age,
          height,
          maritalStatus,
          motherTongue,
          physicalStatus,
          eatingHabits,
          drinkingHabits,
          smokingHabits,
          religion,
          caste,
          subcaste,
          haveDosh,
          star,
          maxHeight,
          minHeight,
          education,
          minAge,
          maxAge,
          highestEducation,
          occupation,
          annualIncome,
          country,
          ancestralOrigin,
        },
        {
          where: { userId },
        },
      );
      return res.status(200).json({
        preference,
        message: 'Preferences updated successfully',
      });
    } else {
      preference = await Preferences.create({
        userId,
        Age,
        height,
        maritalStatus,
        motherTongue,
        physicalStatus,
        eatingHabits,
        drinkingHabits,
        smokingHabits,
        religion,
        caste,
        subcaste,
        haveDosh,
        star,
        maxHeight,
        minHeight,
        education,
        minAge,
        maxAge,
        highestEducation,
        occupation,
        annualIncome,
        country,
        ancestralOrigin,
      });
      return res.status(201).json({
        preference,
        message: 'Preferences created successfully',
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
export const getPreferences = async (req, res, next) => {
  const userId = req.userId;
  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if preferences exist
    const preferences = await Preferences.findOne({ where: { userId } });
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    return res.status(200).json(preferences);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMatchingProfiles = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const userDetails = await UserDetails.findOne({
      where: { userId: req.userId },
    });
   

    if (!userDetails) {
      return res.status(404).json({ error: 'User details not found' });
    }

    const preferences = await Preferences.findOne({
      where: { userId: req.userId },
    });
      console.log("Preferences",preferences.minAge);
    if (!preferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }

    const whereClause = {
      userId: { [Op.ne]: req.userId }, // Exclude the logged-in user
    };

    if (preferences.minAge !== null && preferences.maxAge !== null) {
      whereClause.age = { [Op.between]: [preferences.minAge, preferences.maxAge] };
    }

    if (preferences.minHeight !== null && preferences.maxHeight !== null) {
      whereClause.height = { [Op.between]: [preferences.minHeight, preferences.maxHeight] };
    }

    if (preferences.maritalStatus) {
      whereClause.maritalStatus = preferences.maritalStatus;
    }
    if (preferences.motherTongue) {
      whereClause.motherTongue = preferences.motherTongue;
    }
    if (preferences.physicalStatus) {
      whereClause.physicalStatus = preferences.physicalStatus;
    }
    if (preferences.eatingHabits) {
      whereClause.eatingHabits = preferences.eatingHabits;
    }
    if (preferences.drinkingHabits) {
      whereClause.drinkingHabits = preferences.drinkingHabits;
    }
    if (preferences.smokingHabits) {
      whereClause.smokingHabits = preferences.smokingHabits;
    }
    if (preferences.religion && preferences.religion != 'Any') {
      whereClause.religion = preferences.religion;
    }
    if (preferences.caste && preferences.caste != 'Any Caste') {
      whereClause.caste = preferences.caste;
    }
    if (preferences.subcaste && preferences.subcaste != 'Any Subcaste') {
      whereClause.subcaste = preferences.subcaste;
    }
    // if (preferences.haveDosh !== null) {
    //   whereClause.haveDosh = preferences.haveDosh;
    // }
    if (preferences.star && preferences.star !== 'Any') {
      whereClause.star = preferences.star;
    }
    if (preferences.education && preferences.education !== 'Any') {
      whereClause.highestEducation = preferences.education;
    }
    if (preferences.occupation && preferences.occupation !== 'Any') {
      whereClause.occupation = preferences.occupation;
    }
    if (preferences.country && preferences.country !== 'Any') {
      whereClause.country = preferences.country;
    }

    const matchingProfiles = await UserDetails.findAll({
      where: whereClause,
    });
     
    console.log("UserDetails",matchingProfiles);
    return res.status(200).json(matchingProfiles);

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
export const getAllUserProfile = async (req, res, next) => {
  validationErrorHandler(req, next);
  let id = req?.query?.id;
  try {
    let whereClause = {};
    if (id) {
      whereClause = {
        userId: { [Op.ne]: id },
      };
    }
    const matchingProfiles = await UserDetails.findAll({ where: whereClause });

    return res.status(200).json(matchingProfiles); 
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error); 
  }
};

// export const getRecommendedProfiles = async (req, res, next) => {
//   validationErrorHandler(req, next);
//   try {
//     const userDetails = await UserDetails.findOne({
//       where: { userId: req.userId },
//     });
//     if (!userDetails) {
//       return res.status(404).json({ error: 'User details not found' });
//     }

//     const {
//       lookingFor = '',
//       age = '',
//       religion = '',
//       gender = '',
//       country = '',
//     } = userDetails;

//     const whereClause = {
//       createdAt: {
//         [Op.gt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//       },
//       userId: {
//         [Op.ne]: req.userId,
//       },
//     };

//     if (lookingFor) {
//       switch (lookingFor) {
//         case 'men':
//           whereClause.gender = 'male';
//           break;
//         case 'women':
//           whereClause.gender = 'female';
//           break;
//         case 'All':
//           // No additional gender filter needed
//           break;
//         default:
//           // Handle unexpected values
//           break;
//       }
//     }

//     // Ensure 'gender' in the profile is different from the user's gender preference
//     if (gender) {
//       whereClause.gender = {
//         [Op.ne]: gender,
//       };
//     }
//     if (religion) {
//       whereClause.religion = religion;
//     }
//     if (country) {
//       whereClause.country = country;
//     }

//     // Filter based on age preference within 3-4 years range
//     if (age) {
//       const minAge = age - 5;
//       const maxAge = age + 5;
//       whereClause.age = {
//         [Op.between]: [minAge, maxAge],
//       };
//     }

//     // Query the database for matching profiles
//     const recProfiles = await UserDetails.findAll({
//       where: whereClause,
//     });

//     return res.status(200).json(recProfiles);
//   } catch (error) {
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     return next(error);
//   }
// };
export const getRecommendedProfiles = async (req, res, next) => {
  validationErrorHandler(req, next);
  
  try {
    const currentUser = await UserDetails.findOne({
      where: { userId: req.userId },
    });
       
    if (!currentUser) {
      return res.status(404).json({ error: 'User details not found' });
    }

    // Determine the opposite gender filter based on the current user's gender
    let whereClause;  
    if(currentUser.gender){
        const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male';
        whereClause = {
          userId: {
            [Op.ne]: req.userId, // Exclude the current user
          },
          gender: oppositeGender, // Include only users of the opposite gender
        };
      }
      else{
        whereClause = {
          userId: {
            [Op.ne]: req.userId, // Exclude the current user
          }
        }
      }

  
    const filteredProfiles = await UserDetails.findAll({
      where: whereClause,
    });

    return res.status(200).json(filteredProfiles);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const updateFields = req.body;
    const userId = req.userId;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    if (updateFields.email) {
      user.email = updateFields.email;
    }
    if (updateFields.firstName) {
      user.firstName = updateFields.firstName;
    }
    if (updateFields.lastName) {
      user.lastName = updateFields.lastName;
    }
    await user.save();
    if (req.files && req.files.image) {
      let userDetails = await UserDetails.findOne({ where: { userId } });

      if (userDetails) {
        // Update existing user details
        userDetails = await userDetails.update({
          ...updateFields,
          profilePhoto: req.files.image[0], // Assuming you want to use the first image
        });
        return res
          .status(200)
          .json({ message: 'Profile updated successfully' });
      } else {
        userDetails = await UserDetails.create({
          ...updateFields,
          userId,
          profilePhoto: req.files.image[0], // Assuming you want to use the first image
        });
        return res.status(200).json({ message: 'Profile added successfully' });
      }
    } else {
      let userDetails = await UserDetails.findOne({ where: { userId } });
      if (userDetails) {
        // Update existing user details
        userDetails = await userDetails.update(updateFields);
        return res
          .status(200)
          .json({ message: 'Profile updated successfully' });
      } else {
        // Create new user details entry
        userDetails = await UserDetails.create({
          ...updateFields,
          userId,
        });
        return res.status(200).json({ message: 'Profile added successfully' });
      }
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const viewProfile = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    let userId = req.userId;

    // Fetch user details
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'isActive'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch additional user details
    const userDetails = await UserDetails.findOne({
      where: { userId: userId },
    });

    // Combine user and user details
    const profile = {
      user,
      userDetails: userDetails || null,
    };

    return res.status(200).json(profile);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const viewUserProfile = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    let userId = req.params.userId;

    // Fetch user details
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'isActive'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch additional user details
    const userDetails = await UserDetails.findOne({
      where: { userId: userId },
    });

    // Combine user and user details
    const profile = {
      user,
      userDetails: userDetails || null,
    };

    return res.status(200).json(profile);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
