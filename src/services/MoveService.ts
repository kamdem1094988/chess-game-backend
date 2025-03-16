// src/services/MoveService.ts

// Utilizziamo require per importare js-chess-engine e forzare il tipaggio a "any"
const jsChessEngine: any = require('js-chess-engine');

// Import dei modelli necessari: Game, Move e User
import Game from '../models/Game';
import Move from '../models/Move';
import User from '../models/User';

/**
 * MoveService gestisce la logica di business per eseguire i movimenti in una partita.
 * 
 * Regole di deduzione:
 * - Viene addebitato 0,025 token per ogni mossa effettuata dall'utente (anche per il movimento dell'IA).
 * - L'utente deve avere almeno 0,025 token per poter eseguire una mossa.
 * - Se il credito scende sotto zero durante la partita, la partita può comunque continuare.
 */
export class MoveService {
  /**
   * Esegue un movimento in una partita e, se necessario, esegue anche il movimento dell'IA.
   * 
   * Passaggi principali:
   * 1. Recupera la partita dal database utilizzando l'ID fornito.
   *    - Se la partita non viene trovata, viene lanciata un'eccezione.
   * 
   * 2. Recupera l'utente associato alla partita.
   *    - Se l'utente non esiste o non ha abbastanza token (minimo 0,025), viene lanciata un'eccezione.
   * 
   * 3. Deduce 0,025 token dal credito dell'utente per la mossa.
   *    - Salva l'aggiornamento del credito nel database.
   * 
   * 4. Inizializza l'engine di scacchi con lo stato attuale della partita (memorizzato in formato JSON).
   * 
   * 5. Tenta di eseguire il movimento richiesto ("from" -> "to").
   *    - Se il movimento non è valido, viene lanciata un'eccezione.
   * 
   * 6. Esporta lo stato aggiornato del gioco dall'engine.
   *    - Se lo stato indica che la partita è finita (isFinished o checkMate), aggiorna lo status a "finished".
   * 
   * 7. Registra il movimento dell'utente nella tabella "moves".
   *    - Conta i movimenti già registrati per determinare il numero progressivo della mossa.
   * 
   * 8. Se, dopo la mossa dell'utente, risulta che il turno è del nero, esegue il movimento dell'IA:
   *    - L'IA gioca un movimento (ottenuto tramite chess.aiMove()).
   *    - Registra il movimento dell'IA nella tabella "moves" con il numero progressivo successivo.
   *    - Deduce ulteriori 0,025 token dal credito dell'utente per il movimento dell'IA.
   * 
   * 9. Aggiorna lo stato della partita nel database con lo stato esportato dall'engine.
   * 
   * 10. Restituisce l'oggetto partita aggiornato.
   * 
   * @param gameId - L'ID della partita.
   * @param from - La casella di partenza (es. "e2").
   * @param to - La casella di arrivo (es. "e4").
   * @returns Una Promise che risolve con l'oggetto partita aggiornato.
   */
  static async makeMove(gameId: number, from: string, to: string): Promise<any> {
    // 1. Recupero della partita dal database tramite l'ID
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new Error('Partita non trovata.');
    }

    // 2. Recupero dell'utente associato alla partita
    const user = await User.findByPk(game.userId);
    if (!user || user.tokens < 0.025) {
      throw new Error('Credito insufficiente per effettuare una mossa.');
    }

    // 3. Deduzione del costo della mossa (0,025 token) dal credito dell'utente
    user.tokens -= 0.025;
    await user.save();

    // 4. Inizializzazione dell'engine di scacchi con lo stato attuale della partita (convertito da JSON)
    const chess = new jsChessEngine.Game(JSON.parse(game.state));

    // 5. Tentativo di eseguire il movimento richiesto (dal campo "from" al campo "to")
    try {
      chess.move(from, to);
    } catch (error) {
      // Se il movimento non è valido, viene lanciata un'eccezione
      throw new Error('Mossa non valida.');
    }

    // 6. Esportazione dello stato aggiornato del gioco dall'engine
    const updatedState = chess.exportJson();
    // Se lo stato indica che la partita è terminata (isFinished o checkMate), aggiorna lo status della partita
    if (updatedState.isFinished || updatedState.checkMate) {
      game.status = 'finished';
    }

    // 7. Registrazione del movimento dell'utente nella tabella "moves"
    //    Conta il numero di movimenti già registrati per assegnare il numero progressivo alla mossa
    const moveCount = await Move.count({ where: { gameId } });
    await Move.create({
      gameId,
      from,
      to,
      moveNumber: moveCount + 1,
    });

    // 8. Verifica se il turno dopo la mossa dell'utente è del nero
    if (updatedState.turn === 'black') {
      // L'IA esegue un movimento
      const aiMove = chess.aiMove();
      // Estrae la prima coppia chiave/valore dall'oggetto aiMove (es: [ 'e7', 'e5' ])
      const aiMoveKeys = Object.entries(aiMove)[0];
      const aiFrom = aiMoveKeys[0];
      const aiTo = aiMoveKeys[1] as string; // Forza il tipaggio a string

      // 8.a. Registra il movimento dell'IA nella tabella "moves"
      await Move.create({
        gameId,
        from: aiFrom,
        to: aiTo,
        moveNumber: moveCount + 2,
      });

      // 8.b. Deduce ulteriori 0,025 token per il movimento dell'IA e aggiorna l'utente
      user.tokens -= 0.025;
      await user.save();
    }

    // 9. Aggiorna lo stato della partita nel database con lo stato esportato dall'engine
    game.state = JSON.stringify(chess.exportJson());
    await game.save();

    // 10. Restituisce l'oggetto partita aggiornato
    return game;
  }
}

// Export default per forzare TypeScript a considerare questo file come un modulo
export default {};
