// src/controllers/GameHistoryController.ts

import { Request, Response, NextFunction } from 'express';
import Game from '../models/Game';
import Move from '../models/Move';

export class GameHistoryController {
  /**
   * Récupère l'historique des parties terminées, en indiquant pour chaque partie
   * si elle a été "vinta" (gagnée) ou "interrotta" (interrompue), le nombre total de coups,
   * et la date de début de la partie.
   * 
   * Des filtres optionnels sont disponibles via les query params : 
   * - startDate (YYYY-MM-DD)
   * - endDate (YYYY-MM-DD)
   */
  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const filter: any = { status: 'finished' };

      // Filtre par date de début
      if (startDate) {
        const start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
          res.status(400).json({ message: 'Date de début invalide.' });
          return;
        }
        filter.createdAt = { $gte: start };
      }

      // Filtre par date de fin
      if (endDate) {
        const end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
          res.status(400).json({ message: 'Date de fin invalide.' });
          return;
        }
        if (filter.createdAt) {
          filter.createdAt = { ...filter.createdAt, $lte: end };
        } else {
          filter.createdAt = { $lte: end };
        }
      }

      // Récupérer les parties terminées selon le filtre
      const games = await Game.findAll({ where: filter });

      // Pour chaque partie, compter le nombre de mouvements et déterminer un résultat
      const history = await Promise.all(
        games.map(async (game) => {
          const moveCount = await Move.count({ where: { gameId: game.id } });
          const state = JSON.parse(game.state);
          const result = state.checkMate ? 'vinta' : 'interrotta';

          // Conversion manuelle de createdAt en chaîne, puis en objet Date, enfin toISOString()
          const startDateIso = game.createdAt
            ? new Date(String(game.createdAt)).toISOString()
            : null;

          return {
            gameId: game.id,
            startDate: startDateIso,
            totalMoves: moveCount,
            result,
          };
        })
      );

      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  }
}

// Export vide pour que TypeScript considère ce fichier comme un module
export {};
