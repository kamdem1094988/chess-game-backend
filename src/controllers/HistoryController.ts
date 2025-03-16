// src/controllers/HistoryController.ts

import { Request, Response, NextFunction } from 'express';
import { HistoryService } from '../services/HistoryService';

/**
 * HistoryController gestisce la restituzione dello storico delle mosse di una partita.
 *
 * Passaggi principali:
 * 1. Estrae l'ID della partita dai parametri dell'URL.
 * 2. Chiama il servizio HistoryService.getHistory passando l'ID della partita.
 * 3. Restituisce in risposta il JSON contenente lo storico delle mosse.
 * 4. Se si verifica un errore, viene loggato e passato al middleware di gestione degli errori.
 */
export class HistoryController {
  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Estrai l'ID della partita dai parametri dell'URL e convertilo in numero
      const gameId = Number(req.params.id);
      
      // 2. Chiama il servizio per ottenere lo storico delle mosse della partita
      const history = await HistoryService.getHistory(gameId);
      
      // 3. Invia la risposta con lo storico in formato JSON e uno status 200
      res.status(200).json(history);
    } catch (error) {
      // 4. Se si verifica un errore, logga l'errore e passa l'errore al middleware di gestione degli errori
      console.error("Errore in HistoryController.getHistory:", error);
      next(error);
    }
  }
}

// Export vuoto per forzare TypeScript a considerare questo file come un modulo
export {};
