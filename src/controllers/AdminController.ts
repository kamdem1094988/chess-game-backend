// src/controllers/AdminController.ts

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

/**
 * Controller per le operazioni amministrative.
 * In particolare, questo controller gestisce la ricarica del credito (token) per un utente.
 */
export class AdminController {
  /**
   * Metodo per ricaricare i token (credito) di un utente.
   *
   * Passaggi eseguiti:
   *
   * 1. **Verifica del ruolo admin**:
   *    - Il middleware jwtMiddleware ha impostato `res.locals.user` con i dati dell'utente.
   *    - Se `res.locals.user.role` non è "admin", la richiesta viene bloccata e viene restituito un errore 403 (Accesso negato).
   *
   * 2. **Validazione del body della richiesta**:
   *    - Si estraggono `email` e `amount` da `req.body`.
   *    - Se uno dei due campi è mancante, viene restituito un errore 400 (Bad Request).
   *
   * 3. **Ricerca dell'utente nel database**:
   *    - Si usa il modello `User` per cercare un utente corrispondente all'email fornita.
   *    - Se l'utente non viene trovato, viene restituito un errore 404 (Utente non trovato).
   *
   * 4. **Ricarica del credito**:
   *    - L'importo (`amount`) viene convertito in numero e aggiunto al saldo attuale di token dell'utente.
   *    - La modifica viene salvata nel database con `user.save()`.
   *
   * 5. **Invio della risposta**:
   *    - Viene restituito uno status 200 con un messaggio di successo e i dati aggiornati dell'utente.
   *
   * 6. **Gestione degli errori**:
   *    - In caso di errore, viene chiamato `next(error)` per passare l'errore al middleware di gestione degli errori.
   *
   * @param req - La richiesta HTTP, che contiene nel body i campi "email" e "amount".
   * @param res - La risposta HTTP, utilizzata per inviare il risultato.
   * @param next - La funzione per passare il controllo al middleware successivo in caso di errore.
   */
  static async recharge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Verifica del ruolo admin:
      //    Se l'utente autenticato non ha il ruolo "admin", blocca la richiesta.
      if (res.locals.user?.role !== 'admin') {
        res.status(403).json({ message: 'Accesso negato. Ruolo admin richiesto.' });
        return;
      }

      // 2. Validazione del body della richiesta:
      //    Controlla che "email" e "amount" siano presenti.
      const { email, amount } = req.body;
      if (!email || amount === undefined) {
        res.status(400).json({ message: 'Email e amount sono obbligatori.' });
        return;
      }

      // 3. Ricerca dell'utente:
      //    Cerca l'utente nel database tramite l'email fornita.
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ message: 'Utente non trovato.' });
        return;
      }

      // 4. Ricarica del credito:
      //    Converte "amount" in numero e lo aggiunge al saldo dei token dell'utente.
      user.tokens += Number(amount);
      await user.save();

      // 5. Invio della risposta di successo:
      //    Restituisce lo status 200 con un messaggio e i dati aggiornati dell'utente.
      res.status(200).json({
        message: 'Credito ricaricato con successo.',
        user,
      });
      return;
    } catch (error) {
      // 6. Gestione degli errori:
      //    Se si verifica un errore, passa l'errore al middleware globale.
      next(error);
    }
  }
}

// Esportazione vuota per forzare TypeScript a considerare questo file come un modulo
export {};
