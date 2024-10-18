import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../utilities/database.js';

export const Preferences = sequelize.define('Preference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  minAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maxAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  minHeight: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maxHeight: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maritalStatus: {
    type: DataTypes.ENUM(
      'single',
      'divorced',
      'widowed',
      'married',
      'Separated',
    ),
    allowNull: true,
  },
  motherTongue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  physicalStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  eatingHabits: {
    type: DataTypes.ENUM(
      'vegetarian',
      'non-vegetarian',
      'vegan',
      'flexitarian',
      'halal',
      'junk food',
      'A Little of everything',
    ),
  },
  drinkingHabits: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  smokingHabits: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  religion: {
    type: DataTypes.ENUM(
      'Hinduism',
      'Sikhism',
      'Christianity',
      'Jainism',
      'Islam',
      'Judaism',
      'Buddhism',
      'Shinto',
      'Confucianism',
      'Zoroastrianism',
      'Others',
    ),
    allowNull: true,
  },
  caste: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subcaste: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  haveDosh: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  star: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  annualIncome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Preferences;
