import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  tokens: number;
  role: 'admin' | 'user';
  // ... autres champs
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public tokens!: number;
  public role!: 'admin' | 'user';
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokens: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'), // ou DataTypes.STRING
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
