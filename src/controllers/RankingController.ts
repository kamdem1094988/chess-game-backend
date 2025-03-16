// src/controllers/RankingController.ts

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

/**
 * RankingController gestisce la rotta che restituisce la lista degli utenti
 * ordinata in base al loro punteggio (score).
 *
 * Passaggi principali:
 * 1. Determina l'ordine di ordinamento (ascendente o discendente) in base al parametro di query "order".
 *    - Se "order" è impostato su "asc", l'ordine sarà ASC (ascendente).
 *    - Altrimenti, l'ordine predefinito sarà DESC (discendente).
 *
 * 2. Recupera tutti gli utenti dal database, ordinandoli in base al campo "score".
 *
 * 3. Restituisce la lista degli utenti in formato JSON con uno status 200.
 *
 * 4. Se si verifica un errore, lo passa al middleware di gestione degli errori tramite next(error).
 *
 * @param req - La richiesta HTTP, che può contenere il parametro di query "order".
 * @param res - La risposta HTTP, utilizzata per inviare i dati degli utenti.
 * @param next - La funzione per passare il controllo al middleware successivo in caso di errore.
 */
export class RankingController {
  static async getRanking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Determina l'ordine di ordinamento: "ASC" se "order=asc", altrimenti "DESC"
      const orderParam = req.query.order === 'asc' ? 'ASC' : 'DESC';

      // 2. Recupera tutti gli utenti ordinati per "score"
      const users = await User.findAll({
        order: [['score', orderParam]]
      });
      
      // 3. Invia la risposta con la lista degli utenti in formato JSON, con status 200
      res.status(200).json(users);
    } catch (error) {
      // 4. In caso di errore, passa l'errore al middleware di gestione degli errori
      next(error);
    }
  }
}

// Export vuoto per forzare TypeScript a considerare questo file come un modulo
export {};
