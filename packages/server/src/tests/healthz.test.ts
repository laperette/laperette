import * as request from "supertest";

import { setupTest } from "./setupRouterTest";

describe("healthz", () => {
  it("should return 200", async () => {
    const server = setupTest();
    const response = await request(server).get("/healthz");
    expect(response.status).toStrictEqual(200);
    expect(response.body).toStrictEqual({ ok: true });
  });
});
