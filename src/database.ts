// src/database.ts

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Création de l'instance Sequelize pour SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Nom du fichier SQLite
});

// Importez ici tous vos modèles (mais on ne les synchronise pas automatiquement)
import User from './models/User';
import Game from './models/Game';
import Move from './models/Move';

// Aucune synchronisation ici :
// Vous gérez la création/alteration des tables manuellement dans la base SQLite.

// On exporte simplement l'instance Sequelize pour qu'elle soit disponible ailleurs
export default sequelize;
