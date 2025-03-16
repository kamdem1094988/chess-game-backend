// src/middlewares/adminMiddleware.ts

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware che verifica che l'utente connesso sia un amministratore.
 * Si assume che il middleware JWT abbia già memorizzato le informazioni dell'utente in res.locals.user.
 *
 * Passaggi:
 * 1. Controlla se res.locals.user esiste e se il suo ruolo è "admin".
 * 2. Se l'utente è amministratore, chiama next() per passare il controllo al middleware successivo.
 * 3. Altrimenti, restituisce una risposta con status 403 e un messaggio di errore.
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (res.locals.user && res.locals.user.role === 'admin') {
    // L'utente è amministratore: continua l'esecuzione della catena di middleware
    next();
  } else {
    // L'utente non ha i privilegi amministrativi: restituisce un errore 403 (Accesso negato)
    res.status(403).json({ message: "Accesso negato: privilegi amministrativi richiesti." });
  }
};
