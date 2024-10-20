import express from 'express';
import roomRoutes from '../routes/roomRoutes';
import { sequelize } from '../database/connexion';
import Room from '../models/room';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger/swaggerOptions';
import cors from 'cors';
import helmet from 'helmet';

// Synchronise les modèles avec la base de données (alter: true pour mettre à jour la table existante)
sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables created!');
});

export { sequelize, Room };

const app = express();
// Configuration CORS
app.use(cors());
app.use(helmet());

app.use(express.json());
// Middleware pour servir Swagger UI
app.use('/api-rooms-swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Endpoint pour servir le fichier JSON de la documentation Swagger
app.get('/api-rooms-swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
// Endpoint health
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;