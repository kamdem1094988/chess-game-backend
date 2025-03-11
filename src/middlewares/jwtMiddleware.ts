import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Ajoutez "role" dans l'interface JwtPayload
interface JwtPayload {
  id: number;
  email: string;
  role: string;  // <-- Ajout du rôle
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Accès refusé. Pas de token.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token manquant.' });
    return;
  }
  try {
    // Vérifie et décode le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Stocke l'utilisateur (y compris role) dans res.locals
    res.locals.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};
