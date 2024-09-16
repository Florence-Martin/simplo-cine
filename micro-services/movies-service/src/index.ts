import express from 'express';
import movieRoutes from '../routes/movieRoutes';
import { sequelize } from '../database/connexion';
import Movie from '../models/movie';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger/swaggerOptions';
import cors from 'cors'; 
import helmet from 'helmet';

// Synchronise les modèles avec la base de données ( force : true pour forcer la création/ recréation de la table)
sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables created!');
});

export { sequelize, Movie };

const app = express();
// Configuration CORS
app.use(cors());
app.use(helmet())

app.use(express.json());
// Middleware pour servir Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 
// Endpoint pour servir le fichier JSON de la documentation Swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('api/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {  // N'exécute pas listen() lors des tests
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;