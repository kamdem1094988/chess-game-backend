// src/controllers/MoveController.ts

import { Request, Response, NextFunction } from 'express';
import { MoveService } from '../services/MoveService';

/**
 * MoveController gestisce le richieste relative ai movimenti delle pezze in una partita di scacchi.
 */
export class MoveController {
  /**
   * Effettua un movimento e aggiorna lo stato della partita.
   *
   * Passaggi principali:
   * 1. Estrae l'ID della partita dai parametri dell'URL e i dati "from" e "to" dal body della richiesta.
   * 2. Verifica che i campi "from" e "to" siano stati forniti; in caso contrario, restituisce un errore 400.
   * 3. Chiama il servizio MoveService.makeMove passando l'ID della partita, "from" e "to".
   * 4. Restituisce la partita aggiornata in formato JSON con uno status 200.
   * 5. In caso di errore, passa l'errore al middleware di gestione degli errori tramite next(error).
   *
   * @param req - La richiesta HTTP, contenente l'ID della partita in req.params e "from", "to" in req.body.
   * @param res - La risposta HTTP, usata per inviare il risultato.
   * @param next - La funzione per passare il controllo al middleware successivo in caso di errore.
   */
  static async makeMove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Estrai l'ID della partita dai parametri della richiesta
      const gameId = Number(req.params.id);

      // 2. Estrai "from" e "to" dal body della richiesta
      const { from, to } = req.body;
      
      // 3. Verifica che i campi "from" e "to" siano presenti
      if (!from || !to) {
        res.status(400).json({ message: "I campi 'from' e 'to' sono obbligatori." });
        return;
      }

      // 4. Chiama il servizio per eseguire il movimento
      const updatedGame = await MoveService.makeMove(gameId, from, to);
      
      // 5. Invia la risposta con lo stato aggiornato della partita
      res.status(200).json(updatedGame);
    } catch (error) {
      // 6. In caso di errore, passa l'errore al middleware di gestione degli errori
      next(error);
    }
  }
}

// Export default per forzare TypeScript a considerare questo file come un modulo
export default {};
