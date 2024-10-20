// Gère la connexion des utilisateurs.
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import { generateToken } from "../generateToken";

// Fonction pour gérer la connexion des utilisateurs
export async function signin(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer le token
    const token = generateToken(user.id, user.role.role_name);

    return res.status(200).json({
      message: "Connexion réussie",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}
