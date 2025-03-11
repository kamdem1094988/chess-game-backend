import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameController } from './controllers/GameController';
import { MoveController } from './controllers/MoveController';
import { AuthController } from './controllers/AuthController';
import { HistoryController } from './controllers/HistoryController';
import { RankingController } from './controllers/RankingController'; // Import du contrôleur de classement
import { jwtMiddleware } from './middlewares/jwtMiddleware';

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

// Route publique pour obtenir le classement
// Vous pouvez spécifier l'ordre avec le paramètre de query "order" (asc ou desc)
app.get('/ranking', RankingController.getRanking);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
