import { generateJwtToken } from "../utils/generateToken"; // Utilisation de ton utilitaire
import bcrypt from "bcrypt";
import User from "../models/user";
import Role from "../models/role";

export class AuthService {
  // Inscription
  public async register(
    username: string,
    email: string,
    password: string,
    roleId?: number
  ) {
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
      }

    // Récupérer le rôle ayant le role_name "Admin"
    let role = await Role.findOne({ where: { role_name: "Admin" } });

    if (!role) {
      throw new Error("Aucun rôle Admin trouvé");
    }
      

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        roleId: role.id,
      });

      // Générer le token avec les infos de l'utilisateur
      const token = generateJwtToken({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: role,
      });

      return { user: newUser, token };
    } catch (error) {
      throw new Error(
        "Erreur lors de l'inscription : " + (error as Error).message
      );
    }
  }

  // Connexion
  public async login(email: string, password: string) {
    try {
      const user = await User.findOne({ where: { email }, include: [Role] });
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Mot de passe incorrect");
      }

      // Générer le token avec les infos de l'utilisateur
      const token = generateJwtToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      return { token, user };
    } catch (error) {
      throw new Error(
        "Erreur lors de la connexion : " + (error as Error).message
      );
    }
  }
}
