import { Router } from 'express';
import { createSession, getSessions, getSessionById, updateSession, deleteSession, getSessionsByDate } from '../controllers/sessionController';

const router = Router();

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Créer une nouvelle session
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: ID du film associé à la session
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Heure de début de la session
 *               room:
 *                 type: string
 *                 description: Salle où la session a lieu
 *     responses:
 *       201:
 *         description: Session créée avec succès
 */
router.post('/', createSession);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Récupère la liste de toutes les sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   movieId:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   room:
 *                     type: string
 */
router.get('/', getSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Récupère une session par son ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la session
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 movieId:
 *                   type: integer
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 room:
 *                   type: string
 *       404:
 *         description: Session non trouvée
 */
router.get('/:id', getSessionById);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Met à jour une session existante
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la session à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               room:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session mise à jour avec succès
 *       404:
 *         description: Session non trouvée
 */
router.put('/:id', updateSession);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Supprime une session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la session à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Session supprimée avec succès
 *       404:
 *         description: Session non trouvée
 */
router.delete('/:id', deleteSession);

/**
 * @swagger
 * /sessions/date/:date:
 *   get:
 *     summary: Récupère les sessions par date
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Date des sessions à récupérer (format YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des sessions pour la date spécifiée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   movieId:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   room:
 *                     type: string
 *       404:
 *         description: Aucune session trouvée pour la date spécifiée
 */

router.get('/date/:date', getSessionsByDate);

export default router;