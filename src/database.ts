// src/database.ts

// Importa la classe Sequelize per la gestione della connessione al database
import { Sequelize } from 'sequelize';
// Importa dotenv per caricare le variabili d'ambiente dal file .env
import dotenv from 'dotenv';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

/**
 * Creazione dell'istanza di Sequelize per SQLite.
 * Qui definiamo il dialetto da utilizzare ("sqlite") e il nome del file di database ("database.sqlite").
 * Questo file di database sarà creato nella root del progetto.
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',                 // Specifica l'uso di SQLite come motore di database
  storage: './database.sqlite',      // Nome del file SQLite che conterrà i dati
});

// Importa tutti i modelli necessari per il progetto.
// Questi modelli (User, Game, Move) sono definiti nei rispettivi file all'interno della cartella "models".
// NOTA: In questo file non viene eseguita la sincronizzazione automatica dei modelli (ossia, non si usano sequelize.sync()).
// La creazione o l'alterazione delle tabelle viene gestita manualmente nella base SQLite.
import User from './models/User';
import Game from './models/Game';
import Move from './models/Move';

// Non eseguiamo la sincronizzazione automatica dei modelli.
// Questo perché la gestione della creazione/alterazione delle tabelle viene effettuata manualmente,
// per avere un controllo maggiore sulla struttura del database.

// Esportiamo l'istanza di Sequelize in modo che possa essere utilizzata in altri file del progetto.
export default sequelize;
