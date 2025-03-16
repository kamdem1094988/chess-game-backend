// src/controllers/GameController.ts

import { Request, Response, NextFunction } from 'express';
import { GameService } from '../services/GameService';

/**
 * GameController gestisce le richieste relative alle partite di scacchi.
 */
export class GameController {
  /**
   * Crea una nuova partita.
   *
   * Passaggi eseguiti:
   *
   * 1. Estrae il parametro "difficulty" dal corpo della richiesta (req.body).
   * 2. Recupera l'ID dell'utente autenticato da res.locals.user (impostato dal jwtMiddleware).
   * 3. Se l'utente non è autenticato (userId non presente), restituisce un errore 401 (Utente non autenticato).
   * 4. Chiama il metodo GameService.createGame passando l'ID utente e il livello di difficoltà.
   * 5. Riceve l'oggetto partita creato dal GameService e lo restituisce in risposta con codice 201 (Created).
   * 6. In caso di errore, viene loggato l'errore e passato al middleware di gestione degli errori tramite next(error).
   *
   * @param req - La richiesta HTTP, che contiene il body con il campo "difficulty".
   * @param res - La risposta HTTP, utilizzata per inviare l'oggetto partita creato.
   * @param next - La funzione per passare il controllo al middleware successivo in caso di errore.
   */
  static async createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Estrai il livello di difficoltà dal body della richiesta.
      const { difficulty } = req.body;

      // 2. Recupera l'ID dell'utente autenticato impostato nel middleware jwtMiddleware.
      const userId = res.locals.user?.id;
      
      // 3. Se l'ID utente non è presente, restituisce un errore 401.
      if (!userId) {
        res.status(401).json({ message: 'Utente non autenticato.' });
        return;
      }
      
      // 4. Chiama il servizio per creare una nuova partita.
      const game = await GameService.createGame(userId, difficulty);
      
      // 5. Restituisce la partita creata con codice 201 (Created).
      res.status(201).json(game);
    } catch (error) {
      // 6. Logga l'errore per il debug e passa l'errore al middleware di gestione degli errori.
      console.error("Errore in GameController.createGame:", error);
      next(error);
    }
  }
}

// Export vuoto per forzare TypeScript a trattare questo file come modulo
export {};
