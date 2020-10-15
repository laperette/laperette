import { knex } from "../db/db";
import { verifyPassword } from "../utils/auth";
import * as request from "supertest";
import { createMockAccount, createMockSession } from "../utils/tests";
import app from "../app";
import { Server } from "http";

const mockNewAccountData = {
  firstName: "Eric",
  lastName: "Tabarly",
  email: "admin@gmail.com",
  password: "password",
};

let server: Server;

beforeAll(async () => {
  server = await app.listen();
});

afterAll(() => {
  server.close();
});

describe("Accounts", () => {
  describe("Create a new Account: /signup", () => {
    it("should return status 201 and create an account", async () => {
      const response = await request(server)
        .post("/signup")
        .send(mockNewAccountData);

      const newRow = await knex("accounts")
        .where({
          first_name: "Eric",
          last_name: "Tabarly",
          email: "admin@gmail.com",
        })
        .first();

      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual({
        account: {
          firstName: "Eric",
          lastName: "Tabarly",
        },
      });

      expect(newRow).not.toBeUndefined();
      expect(verifyPassword(newRow, mockNewAccountData.password)).toBeTruthy();
    });
  });

  describe("Get current account: /accounts/current", () => {
    it("should return status 200 and the currently logged in account", async () => {
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

      const [sessionToken] = await createMockSession(accountId, 1);

      const response = await request(server)
        .get("/accounts/current")
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual({
        user: {
          accountId: accountId,
          firstName: "Eric",
          lastName: "Tabarly",
          email: "admin@gmail.com",
        },
      });
    });
  });
});
