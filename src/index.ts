import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import sequelize from './database';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Testez temporairement sans se connecter à la BDD
// sequelize.authenticate()
//   .then(() => console.log('Connexion à la BDD réussie !'))
//   .catch(err => console.error('Erreur de connexion à la BDD :', err));

app.get('/', (req: Request, res: Response) => {
  res.send('Serveur Jeu d’Échecs opérationnel !');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
