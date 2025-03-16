// src/models/User.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

/**
 * Interfaccia che definisce gli attributi di un utente.
 * - id: identificatore univoco (opzionale al momento della creazione).
 * - email: indirizzo email dell'utente.
 * - password: password dell'utente (in chiaro per il test, da cifrare in produzione).
 * - tokens: numero di token disponibili per l'utente.
 * - role: ruolo dell'utente, che può essere 'admin' oppure 'user'.
 * - score: punteggio dell'utente, usato per il ranking.
 */
interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  tokens: number;
  role: 'admin' | 'user';
  score: number;
}

/**
 * Classe User che rappresenta un utente del sistema.
 * Estende il Model di Sequelize e implementa l'interfaccia UserAttributes.
 */
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public tokens!: number;
  public role!: 'admin' | 'user';
  public score!: number;
}

/**
 * Inizializzazione del modello User con User.init.
 * Qui vengono definite le colonne della tabella "users" e le relative configurazioni.
 */
User.init(
  {
    // Colonna "id": chiave primaria auto-incrementante.
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Colonna "email": stringa non nulla e unica.
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Colonna "password": stringa non nulla.
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Colonna "tokens": numero di token dell'utente, con valore predefinito 0.
    tokens: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    // Colonna "role": ruolo dell'utente, con possibili valori 'admin' o 'user'. Valore predefinito "user".
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
    // Colonna "score": punteggio dell'utente per il ranking, con valore predefinito 0.
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,          // L'istanza di Sequelize per la connessione al database
    modelName: 'User',  // Nome del modello
    tableName: 'users', // Nome della tabella nel database
    timestamps: true,   // Abilita la gestione automatica dei campi createdAt e updatedAt
  }
);

// Export del modello User come export di default, per consentire l'importazione facile con "import User from '../models/User';"
export default User;
