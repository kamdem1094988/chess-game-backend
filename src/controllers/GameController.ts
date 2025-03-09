// src/controllers/GameController.ts

import { Request, Response, NextFunction } from 'express';
import { GameService } from '../services/GameService';

/**
 * GameController gère les requêtes relatives aux parties d'échecs.
 */
export class GameController {
  /**
   * Crée une nouvelle partie.
   * Cette méthode ne retourne rien explicitement, elle envoie directement la réponse.
   */
  static async createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { difficulty } = req.body;
      const userId = res.locals.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Utilisateur non authentifié.' });
        return;
      }
      const game = await GameService.createGame(userId, difficulty);
      // Envoyer la réponse sans utiliser "return"
      res.status(201).json(game);
    } catch (error) {
      next(error);
    }
  }
}
