// src/controllers/RankingController.ts

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export class RankingController {
  /**
   * Récupère et renvoie la liste des utilisateurs triés par score.
   * L'ordre de tri est déterminé par le paramètre de query "order" (asc ou desc).
   */
  static async getRanking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Détermine l'ordre de tri : ascendant si "order=asc", sinon descendant par défaut
      const orderParam = req.query.order === 'asc' ? 'ASC' : 'DESC';

      // Récupère tous les utilisateurs triés par le champ "score"
      const users = await User.findAll({
        order: [['score', orderParam]]
      });
      
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

// Export vide pour que TypeScript considère ce fichier comme un module
export {};
