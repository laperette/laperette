import * as request from "supertest";
import { createMockAccount, createMockSession } from "../utils/tests";
import { knex } from "../db/db";
import app from "../app";
import { Server } from "http";

let server: Server;

beforeAll(async () => {
  server = await app.listen();
});

afterAll(() => {
  server.close();
});

describe("Auth", () => {
  describe("Login: /login", () => {
    it("should create an account session and return the logged-in account", async () => {
      const mockNewAccountData = {
        firstName: "Eric",
        lastName: "Tabarly",
        email: "admin@gmail.com",
        password: "password",
      };

      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const response = await request(server).post("/login").send({
        email: mockNewAccountData.email,
        password: mockNewAccountData.password,
      });

      const sessionRow = await knex("sessions")
        .where({ account_id: accountId })
        .first();

      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual({
        account: {
          firstName: mockNewAccountData.firstName,
          lastName: mockNewAccountData.lastName,
        },
      });
      expect(sessionRow).not.toBeUndefined();
    });
  });

  describe("Get account session: /account/sessions", () => {
    it("should return 200 and all the sessions linked to the account", async () => {
      const mockNewAccountData = {
        firstName: "Eric",
        lastName: "Tabarly",
        email: "admin@gmail.com",
        password: "password",
      };

      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const [[currentSessionId], ,] = await Promise.all([
        createMockSession(accountId, 1),
        createMockSession(accountId, 1),
        createMockSession(accountId, 1),
      ]);

      const response = await request(server)
        .get("/account/sessions")
        .set("Cookie", [`laperette_session=${currentSessionId}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.sessions).not.toBeUndefined();
      expect(response.body.sessions.length).toStrictEqual(3);
      expect(response.body.sessions[0].session_id).not.toBeUndefined();
      expect(response.body.sessions[0].account_id).not.toBeUndefined();
      expect(response.body.sessions[0].created_at).not.toBeUndefined();
      expect(response.body.sessions[0].expires_at).not.toBeUndefined();
    });
  });
});
