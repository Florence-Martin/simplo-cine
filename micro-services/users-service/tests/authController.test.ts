const request = require('supertest');
import app from "../src/index";

describe("Auth Controller", () => {
  // Test de la connexion avec un utilisateur admin et retour du token
  it("should authenticate an admin user and return a token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "yourpassword",
    });

    expect(response.status).toBe(200); // Vérification du statut de la réponse
    expect(response.body).toHaveProperty("token"); // Vérification que la réponse contient un token
  });

  // Test de l'échec de connexion avec des identifiants incorrects
  it("should return 401 for incorrect credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401); // Statut attendu pour une authentification échouée
    expect(response.body).toHaveProperty("message"); // Vérifier que la réponse contient un message d'erreur
  });

  // Test de la vérification d'un token valide
  it("should verify a valid token", async () => {
    // Authentification pour récupérer un token valide
    const loginResponse = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "yourpassword",
    });

    const token = loginResponse.body.token; // Extraction du token depuis la réponse de connexion

    // Vérification du token
    const verifyResponse = await request(app)
      .get("/auth/verify-token")
      .set("Authorization", `Bearer ${token}`); // Envoi du token dans l'en-tête Authorization

    expect(verifyResponse.status).toBe(200); // Vérification du statut de la réponse
    expect(verifyResponse.body).toHaveProperty("decoded"); // Vérifier que la réponse contient les données décodées du token
  });

  // Test de la vérification d'un token invalide ou manquant
  it("should return 401 for an invalid token", async () => {
    const invalidToken = "invalidTokenString";

    const response = await request(app)
      .get("/auth/verify-token")
      .set("Authorization", `Bearer ${invalidToken}`); // Envoi d'un token invalide

    expect(response.status).toBe(401); // Statut attendu pour une authentification échouée
    expect(response.body).toHaveProperty("message"); // Vérification de la présence d'un message d'erreur
  });
});
