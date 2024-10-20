// tester les fonctionnalités du userController, comme la récupération de la liste des utilisateurs et les détails d’un utilisateur spécifique.
const request = require("supertest");
import app from "../src/index";

describe("User Controller", () => {
  it("should return a list of users", async () => {
    const response = await (request(app) as any).get("/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should return a single user by ID", async () => {
    const response = await (request(app) as any).get("/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(1);
  });

  it("should return 404 if user not found", async () => {
    const response = await (request(app) as any).get("/users/999");

    expect(response.status).toBe(404);
  });
});
