// src/controllers/GameHistoryController.ts

import { Request, Response, NextFunction } from 'express';
import Game from '../models/Game';
import Move from '../models/Move';

/**
 * Il GameHistoryController gestisce la restituzione dello storico delle partite concluse.
 * Per ogni partita terminata, vengono restituiti:
 * - l'ID della partita,
 * - la data di inizio (createdAt) convertita in formato ISO,
 * - il numero totale di mosse effettuate,
 * - il risultato della partita ("vinta" se c'è checkMate, altrimenti "interrotta").
 * 
 * Sono disponibili filtri opzionali tramite query parameters:
 * - startDate (formato YYYY-MM-DD): filtra le partite create a partire da questa data.
 * - endDate (formato YYYY-MM-DD): filtra le partite create fino a questa data.
 * - download (opzionale): se impostato su "true", il JSON verrà inviato con l'header
 *   Content-Disposition per forzare il download come file "history.json".
 */
export class GameHistoryController {
  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Estrai i parametri di query: startDate, endDate e download
      const { startDate, endDate, download } = req.query;
      
      // Imposta un filtro base per selezionare solo le partite con status 'finished'
      const filter: any = { status: 'finished' };

      // Filtra per data di inizio, se specificata
      if (startDate) {
        const start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
          // Se la data di inizio non è valida, restituisce un errore 400
          res.status(400).json({ message: 'Data di inizio non valida.' });
          return;
        }
        filter.createdAt = { $gte: start };
      }

      // Filtra per data di fine, se specificata
      if (endDate) {
        const end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
          // Se la data di fine non è valida, restituisce un errore 400
          res.status(400).json({ message: 'Data di fine non valida.' });
          return;
        }
        // Se esiste già un filtro su createdAt, aggiunge il limite superiore
        if (filter.createdAt) {
          filter.createdAt = { ...filter.createdAt, $lte: end };
        } else {
          filter.createdAt = { $lte: end };
        }
      }

      // Recupera tutte le partite terminate (status 'finished') in base al filtro
      const games = await Game.findAll({ where: filter });

      // Per ogni partita, conta il numero di mosse e determina il risultato
      const history = await Promise.all(
        games.map(async (game) => {
          // Conta il numero di mosse registrate per questa partita
          const moveCount = await Move.count({ where: { gameId: game.id } });
          // Analizza lo stato della partita salvato come JSON (es. checkMate)
          const state = JSON.parse(game.state);
          // Determina il risultato: "vinta" se c'è checkMate, altrimenti "interrotta"
          const result = state.checkMate ? 'vinta' : 'interrotta';
          
          // Converte il campo createdAt in formato ISO string
          // Forza la conversione in stringa e poi crea un oggetto Date per chiamare .toISOString()
          const startDateIso = game.createdAt
            ? new Date(String(game.createdAt)).toISOString()
            : null;

          // Restituisce le informazioni per questa partita
          return {
            gameId: game.id,
            startDate: startDateIso,
            totalMoves: moveCount,
            result,
          };
        })
      );

      // Se il parametro download è "true", aggiunge l'header per forzare il download del file
      if (download === 'true') {
        res.setHeader('Content-Disposition', 'attachment; filename="history.json"');
      }
      
      // Invia la risposta con status 200 e il JSON dello storico
      res.status(200).json(history);
    } catch (error) {
      // In caso di errore, passa l'errore al middleware di gestione degli errori
      next(error);
    }
  }
}

// Export vuoto per forzare TypeScript a trattare questo file come un modulo
export {};
