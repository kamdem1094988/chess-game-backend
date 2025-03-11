import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameController } from './controllers/GameController';
import { MoveController } from './controllers/MoveController';
import { AuthController } from './controllers/AuthController';
import { HistoryController } from './controllers/HistoryController'; // Import du contrôleur d'historique
import { jwtMiddleware } from './middlewares/jwtMiddleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Route d'authentification
app.post('/login', AuthController.login);

// Route pour créer une partie
app.post('/games', jwtMiddleware, GameController.createGame);

// Route pour effectuer un mouvement dans une partie
app.post('/games/:id/move', jwtMiddleware, MoveController.makeMove);

// Route pour obtenir l'historique des mouvements d'une partie
app.get('/games/:id/history', jwtMiddleware, HistoryController.getHistory);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
