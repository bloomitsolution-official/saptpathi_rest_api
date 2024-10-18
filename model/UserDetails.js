import { DataTypes } from 'sequelize';
import sequelize from '../utilities/database.js';

export const UserDetails = sequelize.define('UserDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'others'),
    allowNull: true,
  },
  gallery: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  height: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lookingFor: {
    type: DataTypes.ENUM('men', 'women', 'All'),
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
  noOfChildren: { type: DataTypes.INTEGER, allowNull: true },
  bodyType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bodyComplexion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  physicalStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  motherTongue: {
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
    allowNull: true,
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
  subCaste: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gothra: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  star: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zodiacSign: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  haveDosh: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  timeOfBirth: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  placeOfBirth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  citizenship: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  residingCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  highestEducation: {
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
  familyValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  familyStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  noofSiblings: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  familyLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hobbies: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  bio: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

export default UserDetails;
