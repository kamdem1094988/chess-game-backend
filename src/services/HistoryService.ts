// src/services/HistoryService.ts

import Move from '../models/Move';

/**
 * Service gérant l'historique des mouvements d'une partie.
 */
export class HistoryService {
  /**
   * Récupère tous les mouvements d'une partie, triés par ordre croissant.
   * @param gameId L'identifiant de la partie.
   * @returns Une promesse résolue avec la liste des mouvements.
   */
  static async getHistory(gameId: number): Promise<any> {
    // Récupérer tous les mouvements pour le gameId donné, triés par moveNumber en ordre croissant
    const moves = await Move.findAll({
      where: { gameId },
      order: [['moveNumber', 'ASC']],
    });
    return moves;
  }
}

// Export vide pour forcer le fichier à être considéré comme un module
export {};
