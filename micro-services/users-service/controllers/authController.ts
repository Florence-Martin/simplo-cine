import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export class AuthController {
  // Inscription
  public async register(req: Request, res: Response): Promise<Response> {
    const { username, email, password, roleId } = req.body;

    try {
      const { user, token } = await authService.register(
        username,
        email,
        password,
        roleId
      );

      return res
        .status(201)
        .json({ message: "Utilisateur créé avec succès", token, user });
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

}
