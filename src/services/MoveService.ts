// src/services/MoveService.ts

// Utilisation de require pour js-chess-engine, comme dans GameService
const jsChessEngine = require('js-chess-engine');

import Game from '../models/Game';
import Move from '../models/Move';

export class MoveService {
  /**
   * Effectue un mouvement dans une partie.
   *
   * @param gameId - L'identifiant de la partie.
   * @param from - La case de départ (ex : "e2").
   * @param to - La case d'arrivée (ex : "e4").
   * @returns La partie mise à jour.
   */
  static async makeMove(gameId: number, from: string, to: string) {
    // Récupérer la partie depuis la base de données
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new Error('Partie non trouvée.');
    }
    
    // Créer une instance de l'engin avec l'état actuel du jeu
    const chess = new jsChessEngine.Game(JSON.parse(game.state));
    
    // Tenter d'effectuer le mouvement
    try {
      chess.move(from, to);
    } catch (error) {
      throw new Error('Mouvement invalide.');
    }
    
    // Exporter l'état mis à jour du jeu
    const updatedState = chess.exportJson();
    
    // Mettre à jour l'état de la partie dans la base de données
    game.state = JSON.stringify(updatedState);
    // On pourrait aussi vérifier si la partie est terminée (échec et mat, etc.) ici
    await game.save();
    
    // Enregistrer le mouvement dans le modèle Move (facultatif)
    const moveCount = await Move.count({ where: { gameId } });
    await Move.create({
      gameId,
      from,
      to,
      moveNumber: moveCount + 1
    });
    
    // Débit de tokens pour le mouvement (ex : 0.025 tokens)
    // Vous pouvez implémenter ici la logique pour débiter le crédit utilisateur,
    // par exemple en récupérant l'utilisateur lié à la partie.
    
    return game;
  }
}
// Ajoutez cette ligne pour s'assurer que TypeScript traite ce fichier comme un module
export default {};