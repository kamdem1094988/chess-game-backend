// src/models/Game.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

interface GameAttributes {
  id?: number;
  userId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  state: string;
  status: 'active' | 'finished' | 'abandoned';
  tokensSpent: number;
}

/**
 * Classe représentant une partie d'échecs.
 */
class Game extends Model<GameAttributes> implements GameAttributes {
  public id!: number;
  public userId!: number;
  public difficulty!: 'easy' | 'medium' | 'hard';
  public state!: string;
  public status!: 'active' | 'finished' | 'abandoned';
  public tokensSpent!: number;
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'finished', 'abandoned'),
      allowNull: false,
      defaultValue: 'active',
    },
    tokensSpent: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: true,
  }
);

export default Game; // Assurez-vous d'exporter le modèle !
