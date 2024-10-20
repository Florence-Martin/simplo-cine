import express, { Request, Response, NextFunction } from "express";
import userRoutes from "../routes/userRoutes";
import authRoutes from "../routes/authRoutes";

import rolesRoutes from "../routes/rolesRoutes";
import { sequelize } from "../database/connexion";
import User from "../models/user";
import Role from "../models/role";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger/swaggerOptions";
import cors from "cors";
import helmet from "helmet";
// import dotenv from "dotenv";

// Charger les variables d'environnement
// dotenv.config();

// Synchronisation des modèles avec la base de données
sequelize
  .sync({ alter: true }) // Utilisez des migrations en production pour plus de contrôle
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la synchronisation avec la base de données:",
      error
    );
  });

export { sequelize, User, Role };

const app = express();

// Configuration de sécurité CORS et Helmet
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.use(helmet());

// Parse les requêtes avec contenu JSON
app.use(express.json());

// Middleware pour Swagger UI et documentation JSON
app.use("/api-users-swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-users-swagger.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes API pour utilisateurs et authentification
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", rolesRoutes);

// Endpoint health
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Middleware de gestion des erreurs globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Une erreur interne est survenue. Veuillez réessayer plus tard.",
  });
});

// Validation des variables d'environnement et lancement du serveur
const PORT = process.env.PORT || 3000;
if (!PORT) {
  throw new Error("PORT is not defined in environment variables.");
}

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
