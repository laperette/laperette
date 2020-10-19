import { createMockContext } from "@shopify/jest-koa-mocks";
import { createMockAccount } from "../utils/tests";
import { validateCredentials } from "./validateCredentials";

const mockNext = jest.fn();

const mockNewAccountData1 = {
  firstName: "Eric",
  lastName: "Tabarly",
  email: "admin@gmail.com",
  password: "password",
};

describe(validateCredentials.name, () => {
  describe("when user sends correct credentials", () => {
    it("should allow resource access", async () => {
      await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const ctx = createMockContext({
        requestBody: {
          email: mockNewAccountData1.email,
          password: mockNewAccountData1.password,
        },
      });

      await validateCredentials(ctx, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
  describe("when user sends incorrect password", () => {
    it("should not allow resource access", async () => {
      await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const ctx = createMockContext({
        requestBody: {
          email: mockNewAccountData1.email,
          password: "wrongPassord",
        },
      });

      await validateCredentials(ctx, mockNext);

      expect(ctx.status).toStrictEqual(401);
      expect(ctx.message).toStrictEqual("Unauthorized");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when user sends incorrect email", () => {
    it("should not allow resource access", async () => {
      await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const ctx = createMockContext({
        requestBody: {
          email: "wrongemail@gmail.com",
          password: mockNewAccountData1.password,
        },
      });

      await validateCredentials(ctx, mockNext);

      expect(ctx.status).toStrictEqual(401);
      expect(ctx.message).toStrictEqual("Unauthorized");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when there is no email in request body", () => {
    it("should not allow resource access", async () => {
      const ctx = createMockContext({
        requestBody: {
          password: "coolpassword",
        },
      });

      await validateCredentials(ctx, mockNext);

      expect(ctx.status).toStrictEqual(401);
      expect(ctx.message).toStrictEqual("Unauthorized");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when there is no password in request body", () => {
    it("should not allow resource access", async () => {
      const ctx = createMockContext({
        requestBody: {
          email: "coolemail@gmail.com",
        },
      });

      await validateCredentials(ctx, mockNext);

      expect(ctx.status).toStrictEqual(401);
      expect(ctx.message).toStrictEqual("Unauthorized");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
