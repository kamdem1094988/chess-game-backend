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
import { GameHistoryController } from './controllers/GameHistoryController';

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

//route pour recuperer l'historique des partie gagner et perdu 
app.get('/games/history', jwtMiddleware, GameHistoryController.getHistory);
//app.get('/games/history', /* jwtMiddleware, */ GameHistoryController.getHistory);


app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
