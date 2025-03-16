// src/services/GameService.ts

// Utilizziamo require per importare js-chess-engine e forzare il tipaggio come "any"
const jsChessEngine: any = require('js-chess-engine');

// Import dei modelli User e Game
import User from '../models/User';
import Game from '../models/Game';

/**
 * GameService gestisce la logica di business per la creazione delle partite di scacchi.
 *
 * Regole di deduzione:
 * - Vengono addebitati 0,50 token al momento della creazione della partita.
 * - L'utente deve avere almeno 0,50 token per poter creare una partita.
 * - Una volta avviata la partita, anche se il credito scende sotto zero, la partita può continuare.
 */
export class GameService {
  static async createGame(userId: number, difficulty: 'easy' | 'medium' | 'hard'): Promise<any> {
    // 1. Recupero dell'utente dal database tramite il suo ID
    const user = await User.findByPk(userId);
    if (!user || user.tokens < 0.50) {
      // Se l'utente non esiste o non ha abbastanza token, viene lanciata un'eccezione
      throw new Error('Crédito insufficiente per creare una partita.');
    }

    // 2. Log di controllo per verificare i dati dell'utente e il livello di difficoltà ricevuto
    console.log("Utente recuperato:", user.toJSON());
    console.log("Difficoltà:", difficulty);

    // 3. Deduzione del costo di creazione: 0,50 token
    user.tokens -= 0.50;
    await user.save();
    console.log("Token dopo la deduzione:", user.tokens);

    // 4. Inizializzazione di una nuova partita di scacchi utilizzando js-chess-engine
    const gameEngine = new jsChessEngine.Game();
    const initialState = gameEngine.exportJson();  // Otteniamo lo stato iniziale del gioco in formato JSON
    console.log("Stato iniziale della partita:", initialState);

    // 5. Creazione della partita nel database
    //    Vengono salvati l'ID dell'utente, la difficoltà, lo stato (convertito in stringa JSON),
    //    lo status (inizialmente 'active') e i token spesi (0,50 token)
    const game = await Game.create({
      userId: user.id,
      difficulty,
      state: JSON.stringify(initialState),
      status: 'active',
      tokensSpent: 0.50
    });
    console.log("Partita creata:", game.toJSON());

    // 6. Restituisce l'oggetto partita creato
    return game;
  }
}
