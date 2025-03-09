// src/models/User.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

interface UserAttributes {
  id?: number;
  email: string;
  tokens: number;
  role: 'admin' | 'user';
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
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
    tokens: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
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

// Pour s'assurer que le fichier est considéré comme un module,
// ajoutez cette exportation vide si nécessaire :
export {};
