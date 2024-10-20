import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  // Récupérer tous les utilisateurs avec leur rôle
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  // Récupérer un utilisateur par ID avec son rôle
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  // Créer un nouvel utilisateur avec rôle
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  // Mettre à jour un utilisateur par ID
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  // Supprimer un utilisateur par ID
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const deletedMessage = await userService.deleteUser(req.params.id);
      res.status(200).json(deletedMessage);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }
}
