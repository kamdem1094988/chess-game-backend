// src/controllers/AuthController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

export class AuthController {
  /**
   * Metodo di login che verifica le credenziali e restituisce un token JWT.
   *
   * Passaggi eseguiti:
   * 1. Estrae "email" e "password" dal corpo della richiesta (req.body).
   * 2. Cerca l'utente nel database utilizzando l'email fornita.
   * 3. Se l'utente non viene trovato, restituisce un errore 401 ("Utente non trovato.").
   * 4. Confronta la password fornita con quella memorizzata nell'utente.
   *    - In questo esempio, il confronto è in chiaro (in produzione si dovrebbero usare hash).
   * 5. Se la password non corrisponde, restituisce un errore 401 ("Password errata.").
   * 6. Logga i dati dell'utente trovato (incluso il campo "role") per scopi di debug.
   * 7. Genera un token JWT includendo nel payload solo i dati strettamente necessari:
   *    - id, email e role dell'utente.
   *    - Il token viene firmato con la chiave segreta definita in .env e scade in 1 ora.
   * 8. Restituisce il token in formato JSON.
   *
   * @param req - La richiesta HTTP contenente email e password.
   * @param res - La risposta HTTP utilizzata per inviare il token o l'errore.
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // 1. Estrai email e password dal corpo della richiesta.
      const { email, password } = req.body;
      
      // 2. Cerca l'utente nel database in base all'email.
      const user = await User.findOne({ where: { email } });
      
      // 3. Se l'utente non viene trovato, restituisci un errore 401.
      if (!user) {
        res.status(401).json({ message: "Utente non trovato." });
        return;
      }
      
      // 4. Confronta la password fornita con quella memorizzata.
      if (user.password !== password) {
        res.status(401).json({ message: "Password errata." });
        return;
      }
      
      // 5. Logga i dati dell'utente per verificare che il campo "role" sia presente.
      console.log("Utente trovato:", user.toJSON());
      
      // 6. Genera il token JWT includendo id, email e role.
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role, // Importante per autorizzare eventuali rotte riservate (es. admin)
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' } // Il token scade in 1 ora.
      );
      
      // 7. Restituisci il token in formato JSON.
      res.json({ token });
    } catch (error) {
      // In caso di errore, restituisce uno status 500 e il messaggio d'errore.
      res.status(500).json({ message: "Errore durante l'autenticazione.", error });
    }
  }
}

// Export vuoto per forzare TypeScript a considerare questo file come un modulo
export {};
