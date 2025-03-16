// src/models/Game.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

/**
 * Interfaccia che definisce gli attributi di una partita.
 * Include:
 * - id: identificatore univoco (opzionale al momento della creazione)
 * - userId: ID dell'utente che ha creato la partita
 * - difficulty: livello di difficoltà ("easy", "medium", "hard")
 * - state: lo stato della partita, memorizzato in formato JSON (stringa)
 * - status: stato della partita ("active", "finished", "abandoned")
 * - tokensSpent: numero di token spesi per la partita
 * - createdAt, updatedAt: date di creazione e aggiornamento (gestite automaticamente da Sequelize)
 */
interface GameAttributes {
  id?: number;
  userId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  state: string;
  status: 'active' | 'finished' | 'abandoned';
  tokensSpent: number;
  
  // Campi per la gestione automatica delle date
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Classe Game che rappresenta una partita di scacchi.
 * Estende Model fornito da Sequelize e implementa l'interfaccia GameAttributes.
 */
class Game extends Model<GameAttributes> implements GameAttributes {
  public id!: number;
  public userId!: number;
  public difficulty!: 'easy' | 'medium' | 'hard';
  public state!: string;
  public status!: 'active' | 'finished' | 'abandoned';
  public tokensSpent!: number;

  // Proprietà che saranno gestite automaticamente da Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Inizializzazione del modello Game tramite Game.init.
 * Qui vengono definite le colonne della tabella "games" e le relative configurazioni.
 */
Game.init(
  {
    // Colonna "id": identificatore univoco, auto-incrementante, chiave primaria.
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Colonna "userId": ID dell'utente associato alla partita, non può essere nullo.
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Colonna "difficulty": livello di difficoltà, limitato ai valori "easy", "medium" o "hard".
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
    },
    // Colonna "state": stato della partita in formato JSON (testo), non può essere nullo.
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Colonna "status": stato della partita, con valori possibili "active", "finished" o "abandoned".
    status: {
      type: DataTypes.ENUM('active', 'finished', 'abandoned'),
      allowNull: false,
      defaultValue: 'active', // Stato predefinito al momento della creazione
    },
    // Colonna "tokensSpent": numero di token spesi per la partita, con valore predefinito 0.
    tokensSpent: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,                   // Istanza di Sequelize per la connessione al database
    modelName: 'Game',           // Nome del modello
    tableName: 'games',          // Nome della tabella nel database
    timestamps: true,            // Abilita la creazione automatica dei campi createdAt e updatedAt
  }
);

// Export del modello Game come export di default, per poter essere importato facilmente in altri file.
export default Game;

// Export vuoto per forzare TypeScript a considerare questo file come un modulo.
export {};
