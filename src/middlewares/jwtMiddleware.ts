// src/middlewares/jwtMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
  role: string; 
}

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Pas de token.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token manquant.' });
    return;
  }
  try {
    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Récupérer l'utilisateur en base
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Utilisateur introuvable.' });
      return;
    }

    // Vérifier le solde de tokens
    if (user.tokens <= 0) {
      res.status(401).json({ message: 'Crédit épuisé, requête non autorisée.' });
      return; // On interrompt l'exécution, mais on ne "renvoie" rien.
    }

    // Stocker l'utilisateur dans res.locals si besoin
    res.locals.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};
