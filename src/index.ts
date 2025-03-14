import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameController } from './controllers/GameController';
import { MoveController } from './controllers/MoveController';
import { AuthController } from './controllers/AuthController';
import { HistoryController } from './controllers/HistoryController';
import { RankingController } from './controllers/RankingController';
import { AdminController } from './controllers/AdminController';  // Import du contrôleur admin
import { jwtMiddleware } from './middlewares/jwtMiddleware';
import { GameHistoryController } from './controllers/GameHistoryController'; // export class GameHistoryController
import GameStatusController from './controllers/GameStatusController';       // export default class GameStatusController

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Route d'authentification
app.post('/login', AuthController.login);

// Routes protégées par JWT
app.post('/games', jwtMiddleware, GameController.createGame);
app.post('/games/:id/move', jwtMiddleware, MoveController.makeMove);
app.get('/games/:id/history', jwtMiddleware, HistoryController.getHistory);

// Route publique pour le classement
app.get('/ranking', RankingController.getRanking);

// Route admin pour recharger le crédit d'un utilisateur
app.post('/admin/recharge', jwtMiddleware, AdminController.recharge);

// Route pour récupérer l'historique des parties gagnées et perdues
app.get('/games/history', jwtMiddleware, GameHistoryController.getHistory);

// Route pour évaluer l'état d'une partie
app.get('/games/:id/status',  jwtMiddleware,  GameStatusController.evaluateStatus);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
