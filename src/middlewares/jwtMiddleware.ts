// src/middlewares/jwtMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

/**
 * Interfaccia per il payload decodificato del token JWT.
 * Contiene solo le informazioni essenziali: id, email e role dell'utente.
 */
interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

/**
 * jwtMiddleware
 * 
 * Questo middleware verifica la presenza e la validità del token JWT nella richiesta.
 * 
 * Passaggi principali:
 * 1. Controlla che l'header Authorization sia presente nella richiesta.
 * 2. Estrae il token dall'header (la parte dopo "Bearer").
 * 3. Utilizza jwt.verify per decodificare il token con la chiave segreta definita nel file .env.
 * 4. Recupera l'utente dal database utilizzando l'ID presente nel payload decodificato.
 * 5. Verifica che l'utente esista e che il suo credito (tokens) sia maggiore di zero.
 * 6. Se tutte le verifiche sono superate, memorizza l'utente in res.locals.user e passa il controllo al middleware successivo con next().
 * 7. In caso di mancanza del token, token mancante, utente non trovato o token invalido, restituisce un errore 401 Unauthorized.
 * 
 * @param req - La richiesta HTTP.
 * @param res - La risposta HTTP.
 * @param next - La funzione per passare il controllo al middleware successivo.
 */
export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // 1. Verifica che l'header "Authorization" sia presente
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Token non fornito.' });
    return;
  }
  
  // 2. Estrai il token dalla stringa "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token mancante.' });
    return;
  }
  
  try {
    // 3. Verifica e decodifica il token JWT utilizzando la chiave segreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // 4. Recupera l'utente dal database utilizzando l'ID decodificato
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Utente non trovato.' });
      return;
    }
    
    // 5. Verifica che l'utente abbia un credito (tokens) positivo
    if (user.tokens <= 0) {
      res.status(401).json({ message: 'Credito esaurito, richiesta non autorizzata.' });
      return; // Interrompe l'esecuzione senza restituire alcun valore
    }
    
    // 6. Salva l'utente in res.locals per poterlo utilizzare nei middleware/controllori successivi
    res.locals.user = user;
    
    // 7. Passa il controllo al middleware successivo
    next();
  } catch (error) {
    // Se il token è invalido o si verifica un altro errore, restituisce un errore 401
    res.status(401).json({ message: 'Token invalido.' });
  }
};
