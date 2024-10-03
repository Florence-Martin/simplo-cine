import Role from "../models/role";
import User from "../models/user";
import { hashPassword } from "../utils/authUtils";

export class UserService {
  // Récupérer tous les utilisateurs
  public async getAllUsers() {
    try {
      return await User.findAll();
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des utilisateurs : " +
          (error as Error).message
      );
    }
  }

  // Récupérer un utilisateur par ID
  public async getUserById(id: string) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      return user;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération de l'utilisateur : " +
          (error as Error).message
      );
    }
  }

  // Créer un nouvel utilisateur
  public async createUser(data: {
    username: string;
    email: string;
    password: string;
    role: Role;
  }) {
    const hashedPassword = await hashPassword(data.password); // Hachage via authUtils
    data.password=hashedPassword;
    try {
      const newUser = await User.create(data);
      return newUser;
    } catch (error) {
      throw new Error(
        "Erreur lors de la création de l'utilisateur : " +
          (error as Error).message
      );
    }
  }

  // Mettre à jour un utilisateur par ID
  public async updateUser(
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      role?: Role;
    }
  ) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      await user.update(data);
      return user;
    } catch (error) {
      throw new Error(
        "Erreur lors de la mise à jour de l'utilisateur : " +
          (error as Error).message
      );
    }
  }

  // Supprimer un utilisateur par ID
  public async deleteUser(id: string) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      await user.destroy();
      return { message: "Utilisateur supprimé avec succès" };
    } catch (error) {
      throw new Error(
        "Erreur lors de la suppression de l'utilisateur : " +
          (error as Error).message
      );
    }
  }
}
