// src/controllers/AdminController.ts

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export class AdminController {
  static async recharge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Vérification du rôle admin
      if (res.locals.user?.role !== 'admin') {
        res.status(403).json({ message: 'Accès refusé. Rôle admin requis.' });
        return;
      }

      const { email, amount } = req.body;
      if (!email || amount === undefined) {
        res.status(400).json({ message: 'Email et amount sont requis.' });
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé.' });
        return;
      }

      user.tokens += Number(amount);
      await user.save();

      res.status(200).json({
        message: 'Crédit rechargé avec succès.',
        user,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}

// Cette ligne garantit que TypeScript considère ce fichier comme un module
export {};
