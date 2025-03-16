// src/index.ts

// Importazione delle dipendenze essenziali
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import dei vari controller che gestiscono le diverse funzionalità dell'applicazione
import { GameController } from './controllers/GameController';
import { MoveController } from './controllers/MoveController';
import { AuthController } from './controllers/AuthController';
import { HistoryController } from './controllers/HistoryController';
import { RankingController } from './controllers/RankingController';
import { AdminController } from './controllers/AdminController'; // Controller per le operazioni admin
// Import del middleware JWT per la protezione delle rotte
import { jwtMiddleware } from './middlewares/jwtMiddleware';
// Import del controller per lo storico delle partite (export nominato)
import { GameHistoryController } from './controllers/GameHistoryController';
// Import del controller per valutare lo stato di una partita (export di default)
import GameStatusController from './controllers/GameStatusController';

dotenv.config(); // Carica le variabili d'ambiente dal file .env

// Creazione dell'app Express
const app = express();

// Middleware globali per gestire JSON e CORS
app.use(express.json());
app.use(cors());

// Definizione della porta su cui il server ascolta, prelevata dal file .env o impostata a 3000 per default
const PORT = process.env.PORT || 3000;

// =======================
// ROTTE DELL'APPLICAZIONE
// =======================

// 1. Rotta di autenticazione
//    Permette all'utente di effettuare il login e ricevere un token JWT
app.post('/login', AuthController.login);

// 2. Rotte protette da JWT (richiedono un token valido)
//    a. Creazione di una nuova partita
app.post('/games', jwtMiddleware, GameController.createGame);

//    b. Effettuare una mossa in una partita specifica
app.post('/games/:id/move', jwtMiddleware, MoveController.makeMove);

//    c. Recuperare lo storico delle mosse di una partita specifica
app.get('/games/:id/history', jwtMiddleware, HistoryController.getHistory);

// 3. Rotta pubblica per il ranking dei giocatori
app.get('/ranking', RankingController.getRanking);

// 4. Rotta amministrativa per ricaricare il credito di un utente
//    Questa rotta richiede un token JWT e l'utente deve avere il ruolo "admin"
app.post('/admin/recharge', jwtMiddleware, AdminController.recharge);

// 5. Rotta per recuperare lo storico delle partite terminate (vittorie e sconfitte)
//    Se richiesto con il parametro "download=true", il JSON verrà inviato come file da scaricare.
app.get('/games/history', jwtMiddleware, GameHistoryController.getHistory);

// 6. Rotta per valutare lo stato di una partita (turno, check, checkMate, ecc.)
//    Restituisce lo stato attuale della partita e gestisce la logica dei punteggi.
app.get('/games/:id/status', jwtMiddleware, GameStatusController.evaluateStatus);

// =======================
// MIDDLEWARE GLOBALE DI GESTIONE DEGLI ERRORI
// =======================
// Questo middleware cattura eventuali errori lanciati in precedenza e invia una risposta appropriata.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Errore intercettato:', err);
  // Se lo status corrente non è stato impostato, si usa 500 (Internal Server Error) come default
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Si è verificato un errore.',
  });
});

// Avvio del server: l'app ascolta sulla porta specificata
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
