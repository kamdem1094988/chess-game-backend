// src/middlewares/adminMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes'; // Import de la librairie pour les codes HTTP

/**
 * Enum per definire i ruoli degli utenti.
 * In questo modo, anziché usare stringhe "admin" o "user" in maniera sparsa, 
 * si utilizza un enum per centralizzare e standardizzare i ruoli.
 */
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

/**
 * Middleware che verifica se l'utente connesso è un amministratore.
 * Si assume che il middleware JWT abbia già impostato le informazioni dell'utente in res.locals.user.
 *
 * Passaggi:
 * 1. Verifica se res.locals.user esiste e se il suo ruolo corrisponde a UserRole.Admin.
 * 2. Se l'utente è amministratore, chiama next() per passare il controllo al middleware successivo.
 * 3. Altrimenti, restituisce una risposta con status 403 (FORBIDDEN) e un messaggio di errore.
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (res.locals.user && res.locals.user.role === UserRole.Admin) {
    // L'utente ha i privilegi amministrativi: passa al middleware successivo
    next();
  } else {
    // L'utente non ha i privilegi amministrativi: restituisce un errore 403 (FORBIDDEN)
    res.status(StatusCodes.FORBIDDEN).json({ message: "Accesso negato: privilegi amministrativi richiesti." });
  }
};
