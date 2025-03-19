// src/seed.ts

import sequelize from './database';
import User from './models/User';

/**
 * Funzione seed() che popola il database con dati di test.
 */
async function seed() {
  try {
    // 1. Sincronizzazione del database con { force: true }
    //    Attenzione: force: true elimina tutte le tabelle esistenti e ricrea la struttura, cancellando i dati precedenti.
    await sequelize.sync({ force: true });

    // 2. Creazione di un utente di test (ruolo 'user')
    await User.create({
      email: 'utilisateur@example.com',  // Indirizzo email dell'utente di test
      password: 'votreMotDePasse',      // Password in chiaro (solo per test)
      tokens: 10,                       // Credito iniziale di token
      role: 'user',                     // Ruolo impostato su 'user'
      score: 0                          // Punteggio iniziale (campo aggiunto per il ranking)
    });

    // 3. Creazione di un secondo utente (ruolo 'admin')
    await User.create({
      email: 'admin@example.com',       // Email dell'utente admin
      password: 'adminpassword',        // Password (in chiaro per il test)
      tokens: 999,                      // Credito (in genere l'admin n'en a pas besoin, ma c'est un exemple)
      role: 'admin',                    // Ruolo impostato su 'admin'
      score: 0                          // Punteggio iniziale
    });

    // Log di conferma per indicare che il seed è stato completato con successo
    console.log('Seed terminato.');
    // Esci con codice 0 per indicare il successo
    process.exit(0);

  } catch (error) {
    // In caso di errore, stampa l'errore e esci con codice 1
    console.error('Errore durante il seed:', error);
    process.exit(1);
  }
}

// Esecuzione della funzione seed()
seed();
