// src/models/Move.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

/**
 * Interfaccia che definisce gli attributi di un movimento.
 * - id: Identificatore univoco del movimento (opzionale al momento della creazione).
 * - gameId: ID della partita a cui appartiene il movimento.
 * - from: La casella di partenza (es. "e2").
 * - to: La casella di arrivo (es. "e4").
 * - moveNumber: Il numero progressivo del movimento nella partita.
 */
interface MoveAttributes {
  id?: number;
  gameId: number;
  from: string;
  to: string;
  moveNumber: number;
}

/**
 * Classe Move che rappresenta un movimento in una partita di scacchi.
 * Estende il Model di Sequelize e implementa l'interfaccia MoveAttributes.
 */
class Move extends Model<MoveAttributes> implements MoveAttributes {
  public id!: number;
  public gameId!: number;
  public from!: string;
  public to!: string;
  public moveNumber!: number;
}

/**
 * Inizializzazione del modello Move tramite Move.init.
 * Qui vengono definite le colonne della tabella "moves" e le relative configurazioni.
 */
Move.init(
  {
    // Colonna "id": identificatore univoco, auto-incrementante, chiave primaria.
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Colonna "gameId": ID della partita a cui appartiene il movimento, non nullo.
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Colonna "from": casella di partenza, es. "e2", non nullo.
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Colonna "to": casella di arrivo, es. "e4", non nullo.
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Colonna "moveNumber": numero progressivo del movimento nella partita, non nullo.
    moveNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,                  // Istanza di Sequelize per la connessione al database
    modelName: 'Move',          // Nome del modello
    tableName: 'moves',         // Nome della tabella nel database
    timestamps: true,           // Abilita i campi automatici createdAt e updatedAt
  }
);

// Export del modello Move come export di default, per poterlo importare facilmente.
export default Move;

// Export vuoto per forzare TypeScript a considerare questo file come un modulo.
export {};
