import { authenticate } from "./authenticate";
import { createMockContext } from "@shopify/jest-koa-mocks";
import { createMockAccount, createMockSession } from "../utils/tests";
import { knex } from "../db/db";

const mockNext = jest.fn();

const mockNewAccountData = {
  firstName: "Eric",
  lastName: "Tabarly",
  email: "admin@gmail.com",
  password: "password",
};

describe(authenticate.name, () => {
  describe("when session id is correct", () => {
    it("should allow resource access", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const [sessionToken] = await createMockSession(accountId, 1);

      const ctx = createMockContext({
        cookies: {
          laperette_session: sessionToken,
        },
      });

      await authenticate(ctx, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
  describe("when there is no session id in cookies", () => {
    it("should not allow resource access", async () => {
      const ctx = createMockContext({
        cookies: {},
      });

      await authenticate(ctx, mockNext);

      expect(ctx.status).toStrictEqual(401);
      expect(ctx.message).toStrictEqual("Unauthorized - No sessionId");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when session id is not valid", () => {
    it("should not allow resource access", async () => {
      const sessionIdNotInDB = "a784a25e-680a-4a37-83ce-5c9c8eb82e9c";

      const ctx = createMockContext({
        cookies: {
          laperette_session: sessionIdNotInDB,
        },
      });

      await authenticate(ctx, mockNext);

      expect(ctx.status).toStrictEqual(401);
      expect(ctx.message).toStrictEqual("Unauthorized - Invalid sessionId");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when session id is deprecated", () => {
    it("should not allow resource access", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const deprecatedSession = {
        account_id: accountId,
        created_at: "2019-10-16 14:32:48.505617+00",
        updated_at: "2019-10-16 14:32:48.505617+00",
        expires_at: "2019-10-23 14:32:48.505617+00",
      };

      const [deprecatedSessionId] = await knex("sessions")
        .insert(deprecatedSession)
        .returning("session_id");

      const ctx = createMockContext({
        cookies: {
          laperette_session: deprecatedSessionId,
        },
      });

      await authenticate(ctx, mockNext);

      expect(ctx.status).toStrictEqual(401);
      expect(ctx.message).toStrictEqual("Unauthorized - Invalid sessionId");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
