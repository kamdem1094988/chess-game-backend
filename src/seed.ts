// src/seed.ts

import sequelize from './database';
import User from './models/User';

async function seed() {
  try {
    // Synchroniser la base (Attention, "force: true" supprimera toutes les données existantes)
    await sequelize.sync({ force: true });

    // Créer un utilisateur de test
    await User.create({
      email: 'utilisateur@example.com',
      password: 'votreMotDePasse',  // Pour le test, en clair (en production, on doit le hacher)
      tokens: 10,
      role: 'user',
    });

    console.log('Seed terminé.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  }
}

seed();
