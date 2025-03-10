// src/models/User.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

// Mise à jour de l'interface pour inclure "password"
interface UserAttributes {
  id?: number;
  email: string;
  password: string;  // Ajout du champ password
  tokens: number;
  role: 'admin' | 'user';
}

/**
 * Classe représentant un utilisateur.
 */
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string; // Propriété password ajoutée
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
    password: {  // Définition du champ password
      type: DataTypes.STRING,
      allowNull: false,
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
export {};  // Pour s'assurer que le fichier est traité comme un module
