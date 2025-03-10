// src/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // ou un autre nom de fichier
});

// Importez ici tous vos modèles
import User from './models/User';
import Game from './models/Game';
import Move from './models/Move';

// Synchronisation des modèles
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Base de données synchronisée.');
  })
  .catch((err) => {
    console.error('Erreur lors de la synchronisation de la BDD:', err);
  });

export default sequelize;
