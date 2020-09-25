const request = require("supertest"); // eslint-disable-line
import { knex } from "../db/db";
import { setupTestRouter } from "../testSetup/setupTestRouter";
import { verifyPassword } from "../utils/auth";
import * as net from "net";
import { addDays } from "date-fns";

const app = setupTestRouter();
let server: net.Server;
beforeEach(() => {
  server = app.listen(8080);
});

afterEach(() => {
  server.close();
});

describe("Create a new Account: /signup", () => {
  it("should return status 201 and create an account", async () => {
    const mockNewAccountData = {
      firstName: "Eric",
      lastName: "Tabarly",
      email: "admin@gmail.com",
      password: "password",
    };

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

    expect(newRow).not.toBeNull();
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

    const [accountId] = await knex("accounts")
      .insert({
        first_name: mockNewAccountData.firstName,
        last_name: mockNewAccountData.lastName,
        email: mockNewAccountData.email,
        password: mockNewAccountData.password,
      })
      .returning("account_id");

    const sessionToken = await knex("sessions")
      .insert({
        account_id: accountId,
        expires_at: addDays(new Date(), 1),
      })
      .returning("session_id");

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
  it("should return status 500 if no account linked to sessionId", async () => {
    const sessionToken = await knex("sessions")
      .insert({
        account_id: "70917482-9163-49f9-ac96-e5a758c0f817",
        expires_at: addDays(new Date(), 1),
      })
      .returning("session_id");

    const response = await request(server)
      .get("/accounts/current")
      .set("Cookie", [`laperette_session=${sessionToken}`]);

    expect(response.status).toStrictEqual(500);
  });
});
