import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameController } from './controllers/GameController';
import { MoveController } from './controllers/MoveController';
import { jwtMiddleware } from './middlewares/jwtMiddleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Route pour créer une partie
app.post('/games', jwtMiddleware, GameController.createGame);

// Route pour effectuer un mouvement dans une partie (exemple : POST /games/1/move)
app.post('/games/:id/move', jwtMiddleware, MoveController.makeMove);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
