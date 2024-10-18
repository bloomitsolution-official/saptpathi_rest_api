import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDetails, User } from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';
import { calculateAge } from '../../helper/fTime.js';
// User login
export const userLogin = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { phone, password } = req.body;

  try {
    const existingUser = await User.findOne({
      where: { phone },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: `User not found with this phone number: ${phone}.`,
      });
    }
    let id = existingUser.id;

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      const error = new Error(`Invalid Password!`);
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      {
        id,
        phone,
      },
      process.env.TOKEN_SIGNING_KEY,
      {
        expiresIn: '1 day',
      },
    );
    const refreshToken = jwt.sign(
      {
        id,
        phone,
      },
      process.env.REFRESH_TOKEN_SIGNING_KEY,
    );
    await User.update(
      {
        token: token,
        refreshToken: refreshToken,
        isVerified: true,
      },
      { where: { phone } },
    );
    return res.status(200).json({
      message: 'Login successful',
      userDetails: {
        userId: existingUser.id,
        name: `${existingUser.firstName} ${existingUser.lastName}`,
        phone,
        token,
        refreshToken,
        email: existingUser.email,
        isActive: existingUser.isActive,
        gender: existingUser.gender,
        isVerified: true,
      },
    });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

// Create User endpoint
export const createUser = async (req, res, next) => {
  validationErrorHandler(req, next);
  const {
    firstName,
    lastName,
    phone,
    email,
    gender,
    password,
    lookingFor,
    dateOfBirth,
    religion,
    country,
  } = req.body;

  try {
    // Check if User already exists with the provided phone number
    const existingUser = await User.findOne({ where: { phone } });

    if (existingUser) {
      const error = new Error(`User with phone number ${phone} already exists`);
      error.statusCode = 401;
      return next(error);
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      gender,
      phone,
      password: hashedPassword,
    });
    // create User Detail
    const userDetails = await UserDetails.create({
      userId: user.id,
      name: `${firstName} ${lastName}`,
      lookingFor,
      dateOfBirth,
      age: calculateAge(dateOfBirth),
      religion,
      country: country,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        ...userDetails,
      },
      message: 'User created successfully 😊',
    });
  } catch (err) {
    console.error('Error creating user:', err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

// Update password endpoint
export const upadteUserPassword = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { phone } = req.params;
  const { newPassword } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        phone,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password before updating
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.update(
      {
        password: hashedNewPassword,
        showPassword: newPassword,
        isDefaultPswd: false,
      },
      {
        where: {
          phone,
        },
      },
    );

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { userId } = req.params;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error(`User with ID ${userId} not found`);
      error.statusCode = 404;
      return next(error);
    }

    await user.destroy();

    return res.status(200).json({
      message: `User with ID ${userId} deleted successfully`,
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
