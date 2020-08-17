import * as request from "supertest";

import { setupTest } from "./setupRouterTest";

describe("signup", () => {
  it("should return status 400 if the body is not present", async () => {
    const server = setupTest();
    const response = await request(server).post("/signup").send();
    expect(response.status).toStrictEqual(400);
  });
});
