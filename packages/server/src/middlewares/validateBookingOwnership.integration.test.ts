import { validateBookingOwnership } from "./validateBookingOwnership";
import { createMockContext } from "@shopify/jest-koa-mocks";
import {
  createMockAccount,
  createMockBooking,
  createMockHouse,
} from "../utils/tests";

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

describe(validateBookingOwnership.name, () => {
  describe("when logged in user is the booking owner", () => {
    it("should allow resource access", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const houseId = await createMockHouse(mockHouseData.name, accountId);

      const [bookingId] = await createMockBooking(
        accountId,
        3,
        3,
        "pending",
        houseId,
      );

      const ctx = createMockContext({
        state: { accountId: accountId },
      });

      ctx.params = {
        bookingId,
      };

      await validateBookingOwnership(ctx, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(ctx.state.booking).not.toBeUndefined();
      expect(ctx.state.booking.booking_id).toEqual(bookingId);
    });
  });
  describe("when the logged in user in not the owner of the booking", () => {
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

      const [bookingId] = await createMockBooking(
        accountId1, // First account is the booking owner
        3,
        3,
        "pending",
        houseId,
      );

      const ctx = createMockContext({
        state: { accountId: accountId2 }, // Second account is logged in
      });

      ctx.params = {
        bookingId,
      };

      await validateBookingOwnership(ctx, mockNext);

      expect(ctx.status).toStrictEqual(403);
      expect(ctx.message).toStrictEqual(
        "Impossible to return this booking - Invalid booking owner",
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when there is no booking id in params", () => {
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

      await validateBookingOwnership(ctx, mockNext);

      expect(ctx.status).toStrictEqual(400);
      expect(ctx.message).toStrictEqual("Invalid booking id");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("when the booking does not exist", () => {
    it("should not allow resource access", async () => {
      const bookingIdNotInDB = "a784a25e-680a-4a37-83ce-5c9c8eb82e9c";

      const [accountId] = await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const ctx = createMockContext({
        state: { accountId: accountId },
      });

      ctx.params = {
        bookingId: bookingIdNotInDB,
      };

      await validateBookingOwnership(ctx, mockNext);

      expect(ctx.status).toStrictEqual(404);
      expect(ctx.message).toStrictEqual("Booking not found");
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
