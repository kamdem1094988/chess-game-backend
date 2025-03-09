import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

sequelize.authenticate()
  .then(() => console.log('Connexion à la BDD SQLite réussie !'))
  .catch(err => console.error('Erreur de connexion à la BDD SQLite :', err));

export default sequelize;
