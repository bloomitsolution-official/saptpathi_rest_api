import express from 'express';
import bcrypt from 'bcrypt';
import { Admin } from '../../model/index.js';
import jwt from 'jsonwebtoken';

// Admin login endpoint
export const adminLogin = async (req, res) => {
  const { phone, password } = req.body;
  console.log("phone",phone,password);
  try {
    const admin = await Admin.findOne({ where: { phone } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    let id = admin.id;
    let name = admin.name;
    let email = admin.email;

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      {
        id,
        name,
        email,
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
        name,
        email,
        phone,
      },
      process.env.REFRESH_TOKEN_SIGNING_KEY,
    );
    await Admin.update(
      {
        token: token,
        refreshToken: refreshToken,
        isActive: true,
        isVerified: true,
      },
      { where: { phone } },
    );
    return res.status(200).json({
      message: 'Login successful',
      userDetails: {
        name,
        phone,
        token,
        refreshToken,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create admin endpoint
export const createAdmin = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if admin already exists with the provided email
    const existingAdmin = await Admin.findOne({ where: { phone } });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin
    const admin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isDefaultPswd: false,
      isActive: true,
      isVerified: true, // Assuming new admins should have default password true
    });
    return res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const upadteAdminPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare hashed old password
    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // Hash the new password before updating
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await admin.update({ password: hashedNewPassword, isDefaultPswd: false });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
