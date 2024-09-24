// Contient les méthodes pour l’inscription, la connexion, etc.

import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { RoleService } from "../services/roleService";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

const authService = new AuthService();

const roleService = new RoleService();

export class AuthController {
  // Inscription
  public async register(req: Request, res: Response): Promise<Response> {
    const { username, email, password } = req.body; // Inclure le rôle dans le corps de la requête
    const role = await roleService.getRoleById(1);
    try {
      // Vérifier si l'utilisateur existe déjà dans la base de données
      // const existingUser = await authService.login(email, password);
      // if (existingUser) {
      //   return res.status(400).json({ message: "L'utilisateur existe déjà" });
      // }

      // Créer un nouvel utilisateur avec le rôle
      const newUser = await authService.register(
        username,
        email,
        password,
        role
      );

      return res
        .status(201)
        .json({ message: "Utilisateur enregistré avec succès", user: newUser });
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  // Connexion
  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const { token, user } = await authService.login(email, password);
      res.setHeader(
        "Set-Cookie",
        `authToken=${token}; Path=/; Max-Age=3600; SameSite=Lax`
      );
      return res.status(200).json({ token, user });
    } catch (error) {
      const err = error as Error;
      return res
        .status(
          err.message === "Invalid password" || err.message === "User not found"
            ? 401
            : 500
        )
        .json({ message: err.message });
    }
  }

  // Vérification d'un token JWT
  public async verifyToken(req: Request, res: Response): Promise<Response> {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token non fourni" });
      }
  
      try {
        const decoded = authService.verifyToken(token);
        return res.status(200).json({ decoded });
      } catch (error) {
        return res.status(401).json({ message: (error as Error).message });
      }
  }
}
