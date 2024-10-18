import { DataTypes } from 'sequelize';
import sequelize from '../utilities/database.js';
const Couples = sequelize.define('Couple', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  aboutUs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brideName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groomName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

export default Couples;
