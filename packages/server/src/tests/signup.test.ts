import * as request from "supertest";

import { setupTest } from "./setupRouterTest";

describe("signup", () => {
  it("should return status 400 if the body is not present", async () => {
    const server = setupTest();
    const response = await request(server).post("/signup").send();
    expect(response.status).toStrictEqual(400);
  });
  it("should return status 200 and create an account", async () => {
    const server = setupTest();
    const response = await request(server).post("/signup").send({
      email: "name@email.com",
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
    });
    expect(response.status).toStrictEqual(200);
  });
});
