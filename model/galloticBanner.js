import { DataTypes } from 'sequelize';
import sequelize from '../utilities/database.js'; // Sequelize instance

const GalloticsBanner = sequelize.define('GalloticBanner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default GalloticsBanner;
