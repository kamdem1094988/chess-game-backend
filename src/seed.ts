// src/seed.ts

// Importa l'istanza di Sequelize per gestire la connessione al database
import sequelize from './database';
// Importa il modello User
import User from './models/User';

/**
 * Funzione seed() che popola il database con dati di test.
 */
async function seed() {
  try {
    // 1. Sincronizzazione del database con { force: true }
    //    Attenzione: force: true elimina tutte le tabelle esistenti e ricrea la struttura, cancellando i dati precedenti.
    await sequelize.sync({ force: true });

    // 2. Creazione di un utente di test
    //    I dati vengono inseriti in chiaro per il test (in produzione, la password deve essere crittografata).
    await User.create({
      email: 'utilisateur@example.com',       // Indirizzo email dell'utente di test
      password: 'votreMotDePasse',              // Password in chiaro (solo per test)
      tokens: 10,                               // Credito iniziale di token
      role: 'user',                             // Ruolo impostato su 'user'
      score: 0                                  // Punteggio iniziale (campo aggiunto per il ranking)
    });

    // 3. Log di conferma per indicare che il seed è stato completato con successo
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
