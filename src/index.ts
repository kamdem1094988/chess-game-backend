import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { jwtMiddleware } from './middlewares/jwtMiddleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/protected', jwtMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'Accès autorisé',
    user: res.locals.user  // Utilisation de res.locals.user
  });
})

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
