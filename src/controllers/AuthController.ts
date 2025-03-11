// src/controllers/AuthController.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

export class AuthController {
  /**
   * Méthode de login qui vérifie les identifiants et renvoie un token JWT.
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Recherche de l'utilisateur par email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Utilisateur non trouvé." });
        return;
      }

      // Vérification du mot de passe (ici, comparaison en clair pour le test)
      if (user.password !== password) {
        res.status(401).json({ message: "Mot de passe incorrect." });
        return;
      }

      // Log pour vérifier que 'role' est bien chargé depuis la base
      console.log("Utilisateur trouvé :", user.toJSON());

      // Génération du token JWT avec une expiration d'une heure
      // Ajout du champ role pour que le middleware admin puisse vérifier si l'utilisateur est admin
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,  // <-- important pour inclure le rôle
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'authentification.", error });
    }
  }
}

// Export vide pour garantir que ce fichier est traité comme un module
export {};
