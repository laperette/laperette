import { createMockContext } from "@shopify/jest-koa-mocks";
import { createMockAccount, createMockHouse } from "../utils/tests";
import { validateHouseMembership } from "./validateHouseMembership";

const mockNext = jest.fn();

const mockNewAccountData1 = {
  firstName: "Eric",
  lastName: "Tabarly",
  email: "admin@gmail.com",
  password: "password",
};

const mockNewAccountData2 = {
  firstName: "Robert",
  lastName: "Surcouf",
  email: "member@gmail.com",
  password: "password",
};

const mockHouseData = {
  name: "Longwood House",
};

describe(validateHouseMembership.name, () => {
  describe("when logged in user is a house member", () => {
    it("should allow resource access", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const houseId = await createMockHouse(mockHouseData.name, accountId);

      const ctx = createMockContext({
        state: { accountId: accountId },
      });

      ctx.params = {
        houseId,
      };

      await validateHouseMembership(ctx, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
  describe("when the logged in user in not a house member", () => {
    it("should not allow resource access", async () => {
      const [[accountId1], [accountId2]] = await Promise.all([
        createMockAccount(
          mockNewAccountData1.firstName,
          mockNewAccountData1.lastName,
          mockNewAccountData1.email,
          mockNewAccountData1.password,
        ),
        createMockAccount(
          mockNewAccountData2.firstName,
          mockNewAccountData2.lastName,
          mockNewAccountData2.email,
          mockNewAccountData2.password,
        ),
      ]);

      const houseId = await createMockHouse(mockHouseData.name, accountId1);

      const ctx = createMockContext({
        state: { accountId: accountId2 }, // Second account is logged in
      });

      ctx.params = {
        houseId,
      };

      await validateHouseMembership(ctx, mockNext);

      expect(ctx.status).toStrictEqual(403);
      expect(ctx.message).toStrictEqual(
        "Unauthorized - User not a member of requested house",
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when there is no house id in params", () => {
    it("should not allow resource access", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const ctx = createMockContext({
        state: { accountId: accountId },
      });

      ctx.params = {};

      await validateHouseMembership(ctx, mockNext);

      expect(ctx.status).toStrictEqual(400);
      expect(ctx.message).toStrictEqual("Invalid house id");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
