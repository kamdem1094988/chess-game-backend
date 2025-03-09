import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameController } from './controllers/GameController';
import { jwtMiddleware } from './middlewares/jwtMiddleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.post('/games', jwtMiddleware, GameController.createGame);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
