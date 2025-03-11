// src/controllers/HistoryController.ts

import { Request, Response, NextFunction } from 'express';
import { HistoryService } from '../services/HistoryService';

export class HistoryController {
  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = Number(req.params.id);
      const history = await HistoryService.getHistory(gameId);
      res.status(200).json(history);
    } catch (error) {
      console.error("Erreur dans HistoryController.getHistory:", error);
      next(error);
    }
  }
}

// Pour que TypeScript considère ce fichier comme un module
export {};
