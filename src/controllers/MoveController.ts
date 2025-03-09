// src/controllers/MoveController.ts

import { Request, Response, NextFunction } from 'express';
import { MoveService } from '../services/MoveService';

/**
 * Contrôleur gérant les mouvements des pièces dans une partie d'échecs.
 */
export class MoveController {
  /**
   * Effectue un mouvement et met à jour l'état de la partie.
   */
  static async makeMove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = Number(req.params.id);
      const { from, to } = req.body;
      
      // Vérifier que les données sont bien fournies
      if (!from || !to) {
        res.status(400).json({ message: "Les champs 'from' et 'to' sont requis." });
        return;
      }

      const updatedGame = await MoveService.makeMove(gameId, from, to);
      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }
}

// Ajoutez cette ligne pour s'assurer que TypeScript traite ce fichier comme un module
export default {};
