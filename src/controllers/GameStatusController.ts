// src/controllers/GameStatusController.ts

import { Request, Response, NextFunction } from 'express';
import Game from '../models/Game';
import User from '../models/User';

// Importiamo js-chess-engine come "any" per forzare il tipaggio
const jsChessEngine: any = require('js-chess-engine');

/**
 * GameStatusController
 *
 * Questo controller è responsabile di valutare lo stato di una partita.
 * In particolare, restituisce:
 *  - L'ID della partita.
 *  - Lo status della partita (active, finished, abandoned).
 *  - Il turno attuale (white o black).
 *  - Se la partita è terminata (isFinished).
 *  - Se c'è scacco (check) o scacco matto (checkMate).
 *
 * Inoltre, se la partita risulta in checkMate, aggiorna lo status a "finished"
 * e accredita 1 punto al giocatore. Se la partita è stata abbandonata, viene sottratto 0.5 punto.
 */
export default class GameStatusController {
  static async evaluateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Estrazione dell'ID della partita dai parametri della richiesta
      const gameId = Number(req.params.id);

      // 2. Recupero della partita dal database tramite l'ID
      const game = await Game.findByPk(gameId);
      if (!game) {
        // Se la partita non viene trovata, restituisce un errore 404
        res.status(404).json({ message: 'Partita non trovata.' });
        return;
      }

      // 3. Analisi dello stato della partita
      //    Si crea un'istanza di js-chess-engine utilizzando lo stato (state) salvato in formato JSON nel database.
      const chess = new jsChessEngine.Game(JSON.parse(game.state));
      const state = chess.exportJson(); // Otteniamo un oggetto che contiene moves, pieces, turn, isFinished, check, checkMate, ecc.

      // 4. Preparazione dei dati di risposta di base
      const responseData: any = {
        gameId: game.id,          // ID della partita
        status: game.status,      // Status della partita (active, finished, abandoned)
        turn: state.turn,         // Turno attuale ("white" o "black")
        isFinished: state.isFinished, // Booleano che indica se la partita è terminata
        check: state.check,       // Booleano che indica se c'è scacco
        checkMate: state.checkMate, // Booleano che indica se c'è scacco matto
      };

      // 5. Gestione dei casi in cui la partita è già terminata
      if (game.status === 'finished') {
        responseData.message = 'Partita terminata.';
      } else if (game.status === 'abandoned') {
        responseData.message = 'Partita abbandonata.';
      }

      // 6. Se la partita risulta in checkMate:
      if (state.checkMate) {
        // Imposta il messaggio di risposta
        responseData.message = 'Checkmate: partita terminata.';
        // Se lo status della partita non è ancora "finished", lo aggiorna
        if (game.status !== 'finished') {
          game.status = 'finished';
          await game.save();
        }
        // Recupera l'utente che ha creato la partita
        const user = await User.findByPk(game.userId);
        if (user) {
          // Aggiunge 1 punto al punteggio dell'utente (se il campo score non esiste, si assume 0)
          user.score = (user.score ?? 0) + 1;
          await user.save();
          // Specifica il punteggio assegnato nella risposta
          responseData.pointsAwarded = '+1';
        }
      }

      // 7. Se la partita è stata abbandonata:
      if (game.status === 'abandoned') {
        const user = await User.findByPk(game.userId);
        if (user) {
          // Sottrae 0.5 punto al punteggio dell'utente
          user.score = (user.score ?? 0) - 0.5;
          await user.save();
          responseData.pointsAwarded = '-0.5';
        }
      }

      // 8. Invia la risposta con i dati della partita valutata
      res.status(200).json(responseData);
    } catch (error) {
      // 9. Gestione degli errori: se si verifica un errore, viene passato al middleware di gestione degli errori
      next(error);
    }
  }
}

// Export vuoto per forzare TypeScript a considerare questo file come un modulo
export {};
