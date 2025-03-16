// src/services/HistoryService.ts

import Move from '../models/Move';

/**
 * HistoryService gestisce la logica per recuperare lo storico dei movimenti di una partita.
 */
export class HistoryService {
  /**
   * Recupera tutti i movimenti di una partita, ordinati in ordine crescente.
   *
   * Passaggi principali:
   * 1. Utilizza il modello Move per cercare tutti i movimenti associati ad una partita, filtrando per gameId.
   * 2. Ordina i movimenti per il campo "moveNumber" in ordine ascendente, per mantenere la sequenza corretta.
   * 3. Restituisce la lista dei movimenti.
   *
   * @param gameId - L'identificativo della partita per cui recuperare lo storico.
   * @returns Una Promise che risolve con la lista dei movimenti.
   */
  static async getHistory(gameId: number): Promise<any> {
    // 1. Recupera tutti i movimenti per il gameId dato, ordinandoli per moveNumber in ordine ascendente
    const moves = await Move.findAll({
      where: { gameId },
      order: [['moveNumber', 'ASC']],
    });
    // 2. Restituisce la lista dei movimenti
    return moves;
  }
}

// Export vuoto per forzare TypeScript a considerare questo file come un modulo
export {};
