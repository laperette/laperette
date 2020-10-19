import { createMockContext } from "@shopify/jest-koa-mocks";
import { createMockAccount } from "../utils/tests";
import { validateCreateAccountData } from "./validateNewAccount";

const mockNext = jest.fn();

const mockNewAccountData1 = {
  firstName: "Eric",
  lastName: "Tabarly",
  email: "admin@gmail.com",
  password: "password",
};

describe(validateCreateAccountData.name, () => {
  describe("when account does not exist already and data is correct", () => {
    it("should allow resource creation", async () => {
      const ctx = createMockContext({
        requestBody: {
          firstName: mockNewAccountData1.firstName,
          lastName: mockNewAccountData1.lastName,
          email: mockNewAccountData1.email,
          password: mockNewAccountData1.password,
        },
      });

      await validateCreateAccountData(ctx, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
  describe("when account already exists", () => {
    it("should not allow resource creation", async () => {
      await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const ctx = createMockContext({
        requestBody: {
          firstName: mockNewAccountData1.firstName,
          lastName: mockNewAccountData1.lastName,
          email: mockNewAccountData1.email,
          password: mockNewAccountData1.password,
        },
      });

      await validateCreateAccountData(ctx, mockNext);

      expect(ctx.status).toStrictEqual(409);
      expect(ctx.message).toStrictEqual("Account already exists");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when the new account data is incorrect", () => {
    it("should not allow resource creation", async () => {
      const ctx = createMockContext({
        requestBody: {
          lastName: mockNewAccountData1.lastName,
          password: "",
        },
      });

      await validateCreateAccountData(ctx, mockNext);

      expect(ctx.status).toStrictEqual(400);
      expect(ctx.message).toStrictEqual("Incorrect parameters");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
