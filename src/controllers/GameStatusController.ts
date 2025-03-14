// src/controllers/GameStatusController.ts

import { Request, Response, NextFunction } from 'express';
import Game from '../models/Game';
import User from '../models/User';

const jsChessEngine: any = require('js-chess-engine');

export default class GameStatusController {
  /**
   * Évalue l'état d'une partie : tour actuel, échec, échec et mat,
   * et gère les points (1 point pour victoire, -0.5 pour abandon).
   */
  static async evaluateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = Number(req.params.id);

      // Récupérer la partie
      const game = await Game.findByPk(gameId);
      if (!game) {
        res.status(404).json({ message: 'Partie non trouvée.' });
        return;
      }

      // Analyser l'état du jeu
      const chess = new jsChessEngine.Game(JSON.parse(game.state));
      const state = chess.exportJson(); // { moves, pieces, turn, isFinished, check, checkMate, ... }

      // Préparer la réponse de base
      const responseData: any = {
        gameId: game.id,
        status: game.status,
        turn: state.turn,
        isFinished: state.isFinished,
        check: state.check,
        checkMate: state.checkMate,
      };

      // Logique de partie terminée, checkmate, abandon, etc.
      if (game.status === 'finished') {
        responseData.message = 'Partie terminée.';
      } else if (game.status === 'abandoned') {
        responseData.message = 'Partie abandonnée.';
      }

      if (state.checkMate) {
        responseData.message = 'Checkmate: partie terminée.';
        if (game.status !== 'finished') {
          game.status = 'finished';
          await game.save();
        }
        const user = await User.findByPk(game.userId);
        if (user) {
          user.score = (user.score ?? 0) + 1;
          await user.save();
          responseData.pointsAwarded = '+1';
        }
      }

      if (game.status === 'abandoned') {
        const user = await User.findByPk(game.userId);
        if (user) {
          user.score = (user.score ?? 0) - 0.5;
          await user.save();
          responseData.pointsAwarded = '-0.5';
        }
      }

      res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  }
}

// Export vide pour forcer TypeScript à considérer ce fichier comme un module
export {};
