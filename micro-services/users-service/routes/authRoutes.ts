import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: "Rôle de l'utilisateur (ex: admin, user)"  # Correction ici
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       401:
 *         description: Identifiants incorrects
 */
router.post("/signin", authController.login);

/**
 * @swagger
 * /auth/verifyToken:
 *   get:
 *     summary: Vérifie la validité d'un jeton JWT
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Jeton d'accès JWT au format `Bearer <token>`
 *         schema:
 *           type: string
 *           example: "Bearer <votre_jeton>"
 *     responses:
 *       200:
 *         description: Jeton valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 userId:
 *                   type: string
 *                   description: ID de l'utilisateur associé au jeton
 *                   example: "123456"
 *       401:
 *         description: Jeton invalide ou expiré
 */
router.get("/verifyToken", authController.verifyToken);

export default router;
