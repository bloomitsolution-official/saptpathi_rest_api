import { DataTypes } from 'sequelize';
import sequelize from '../utilities/database.js';

const MatchRequest = sequelize.define('MatchRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
});
export default MatchRequest;
