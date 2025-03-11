// src/services/MoveService.ts

// Utilisation de require pour importer js-chess-engine et forcer le typage en "any"
const jsChessEngine: any = require('js-chess-engine');

import Game from '../models/Game';
import Move from '../models/Move';
import User from '../models/User';

export class MoveService {
  /**
   * Effectue un mouvement dans une partie et fait jouer l'IA si nécessaire.
   *
   * @param gameId - L'identifiant de la partie.
   * @param from - La case de départ (ex : "e2").
   * @param to - La case d'arrivée (ex : "e4").
   * @returns La partie mise à jour après le coup du joueur (et potentiellement de l'IA).
   */
  static async makeMove(gameId: number, from: string, to: string): Promise<any> {
    // Récupérer la partie depuis la base de données
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new Error('Partie non trouvée.');
    }

    // Vérifier que l'utilisateur a assez de tokens pour jouer
    const user = await User.findByPk(game.userId);
    if (!user || user.tokens < 0.025) {
      throw new Error('Crédit insuffisant pour effectuer un mouvement.');
    }

    // Déduire le coût du mouvement
    user.tokens -= 0.025;
    await user.save();

    // Créer une instance de l'engin avec l'état actuel du jeu
    const chess = new jsChessEngine.Game(JSON.parse(game.state));

    // Tenter d'effectuer le mouvement du joueur
    try {
      chess.move(from, to);
    } catch (error) {
      throw new Error('Mouvement invalide.');
    }

    // Vérifier si la partie est terminée après le coup du joueur
    const updatedState = chess.exportJson();
    if (updatedState.isFinished || updatedState.checkMate) {
      game.status = 'finished';
    }

    // Sauvegarder le mouvement du joueur
    const moveCount = await Move.count({ where: { gameId } });
    await Move.create({
      gameId,
      from,
      to,
      moveNumber: moveCount + 1,
    });

    // Vérifier si l'IA doit jouer (le tour est à "black")
    if (updatedState.turn === 'black') {
      // L'IA joue un coup
      const aiMove = chess.aiMove();
      const aiMoveKeys = Object.entries(aiMove)[0]; // Exemple : [ 'e7', 'e5' ]
      const aiFrom = aiMoveKeys[0];
      const aiTo = aiMoveKeys[1] as string; // Assertion : forcer aiTo à être une string

      // Sauvegarder le mouvement de l'IA
      await Move.create({
        gameId,
        from: aiFrom,
        to: aiTo,
        moveNumber: moveCount + 2,
      });

      // Déduire les tokens de l'utilisateur pour le coup de l'IA
      user.tokens -= 0.025;
      await user.save();
    }

    // Mettre à jour l'état du jeu dans la base de données
    game.state = JSON.stringify(chess.exportJson());
    await game.save();

    return game;
  }
}

// Ajoutez cette ligne pour éviter que TypeScript considère le fichier comme vide
export default {};
