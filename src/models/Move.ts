// src/models/Move.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

// Interface définissant les attributs d'un mouvement
interface MoveAttributes {
  id?: number;
  gameId: number;
  from: string;    // Exemple : "e2"
  to: string;      // Exemple : "e4"
  moveNumber: number;
}

// Classe représentant un mouvement dans une partie d'échecs
class Move extends Model<MoveAttributes> implements MoveAttributes {
  public id!: number;
  public gameId!: number;
  public from!: string;
  public to!: string;
  public moveNumber!: number;
}

// Initialisation du modèle avec la configuration Sequelize
Move.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moveNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Move',
    tableName: 'moves',
    timestamps: true,
  }
);

export default Move;

// Ajoutez cette ligne pour forcer TypeScript à considérer ce fichier comme un module, 
// même s'il n'y a pas d'autres exportations supplémentaires.
export {};
