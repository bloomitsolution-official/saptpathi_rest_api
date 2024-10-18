import { DataTypes } from 'sequelize';
import sequelize from '../utilities/database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reviewerProfilePic: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  reviewerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  reviewerRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  starRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

export default Review;
