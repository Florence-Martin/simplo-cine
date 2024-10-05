// Gère l’inscription des nouveaux utilisateurs.
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import Role from "../../models/role"; // Assurez-vous que le modèle Role est importé
import { generateJwtToken } from "../../utils/generateToken"; 

// Fonction pour inscrire un nouvel utilisateur
export async function register(req: Request, res: Response): Promise<Response> {
  const { username, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Récupérer l'ID du rôle "admin"
    const adminRole = await Role.findOne({ where: { role_name: 'admin' } });
    if (!adminRole) {
      return res.status(500).json({ message: "Rôle 'admin' introuvable" });
    }

    // Créer l'utilisateur avec le rôle "admin"
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: adminRole.id, // Utilisation de l'ID du rôle
    });

    // Générer le token pour l'utilisateur inscrit
    const token = generateJwtToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: adminRole, // Passer le nom du rôle pour le token
    });

    return res.status(201).json({
      message: "Utilisateur inscrit avec succès",
      user: newUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}
