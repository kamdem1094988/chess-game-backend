// src/services/GameService.ts

// Utiliser require pour importer js-chess-engine
const jsChessEngine = require('js-chess-engine');

// Import des modèles User et Game
import User from '../models/User';
import Game from '../models/Game';

/**
 * Service gérant la logique métier pour la création des parties d'échecs.
 */
export class GameService {
  /**
   * Crée une nouvelle partie d'échecs pour un utilisateur donné.
   *
   * @param userId - L'identifiant de l'utilisateur créant la partie.
   * @param difficulty - Le niveau de difficulté choisi ('easy', 'medium' ou 'hard').
   * @returns Une promesse résolue avec l'objet Game créé.
   * @throws Une erreur si l'utilisateur n'existe pas ou si son crédit est insuffisant.
   */
  static async createGame(userId: number, difficulty: 'easy' | 'medium' | 'hard') {
    // Récupération de l'utilisateur dans la base de données
    const user = await User.findByPk(userId);
    if (!user || user.tokens < 0.50) {
      throw new Error('Crédit insuffisant pour créer une partie.');
    }

    // Déduction du coût de création (0.50 tokens)
    user.tokens -= 0.50;
    await user.save();

    // Initialisation d'une nouvelle partie d'échecs avec js-chess-engine via require
    const gameEngine = new jsChessEngine.Game();
    const initialState = gameEngine.exportJson();

    // Création de la partie dans la base de données
    const game = await Game.create({
      userId: user.id,
      difficulty,
      state: JSON.stringify(initialState),
      status: 'active',
      tokensSpent: 0.50
    });

    return game;
  }
}
