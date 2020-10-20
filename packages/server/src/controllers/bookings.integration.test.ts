import request from "supertest";
import {
  addMockAccountToMockHouse,
  createMockAccount,
  createMockBooking,
  createMockHouse,
  createMockSession,
} from "../utils/tests";
import { knex } from "../db/db";
import { addDays, lastDayOfMonth, startOfMonth } from "date-fns";

import { BookingForClient } from "../types/bookings";
import app from "../app";
import { Server } from "http";

let server: Server;

beforeAll(async () => {
  server = await app.listen();
});

afterAll(() => {
  server.close();
});

describe("Bookings", () => {
  const mockNewAccountData = {
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

  const mockHouseData2 = {
    name: "La Confiance",
  };

  describe("Create a booking: /houses/:houseId/bookings/booking", () => {
    it("should create and return a booking", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const houseId = await createMockHouse(mockHouseData.name, accountId);

      const [sessionToken] = await createMockSession(accountId, 1);

      const mockBookingData = {
        arrivalTime: addDays(new Date(), 1),
        departureTime: addDays(new Date(), 5),
        comments: "Eager to be there!",
        companions: 2,
      };

      const response = await request(server)
        .post(`/houses/${houseId}/bookings/booking`)
        .send(mockBookingData)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      const newBookingRow = await knex("bookings")
        .where({
          booker_id: accountId,
          house_id: houseId,
          comments: mockBookingData.comments,
          companions: mockBookingData.companions,
        })
        .first();

      expect(response.status).toStrictEqual(201);
      expect(response.body.bookingId).not.toBeUndefined();
      expect(response.body.bookingId).toStrictEqual(newBookingRow.booking_id);
    });

    describe("when booking data is invalid", () => {
      it("should not create a booking and return 400", async () => {
        const [accountId] = await createMockAccount(
          mockNewAccountData.firstName,
          mockNewAccountData.lastName,
          mockNewAccountData.email,
          mockNewAccountData.password,
        );

        const houseId = await createMockHouse(mockHouseData.name, accountId);

        const [sessionToken] = await createMockSession(accountId, 1);

        const departureTime = addDays(new Date(), 5);

        const laterDateThanDepartureTime = addDays(new Date(), 10);

        const invalidArrivalTime = laterDateThanDepartureTime;

        const mockInvalidBookingData = {
          arrivalTime: invalidArrivalTime,
          departureTime: departureTime,
          comments: "Eager to be there!",
          companions: 2,
        };

        const response = await request(server)
          .post(`/houses/${houseId}/bookings/booking`)
          .send(mockInvalidBookingData)
          .set("Cookie", [`laperette_session=${sessionToken}`]);

        const newBookingRow = await knex("bookings")
          .where({
            booker_id: accountId,
            house_id: houseId,
            comments: mockInvalidBookingData.comments,
            companions: mockInvalidBookingData.companions,
          })
          .first();

        expect(response.status).toStrictEqual(400);
        expect(response.body.bookingId).toBeUndefined();
        expect(newBookingRow).toBeUndefined();
      });
    });
  });

  describe("Get all the bookings of an account: /bookings", () => {
    it("should return all the bookings of an account", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const houseId = await createMockHouse(mockHouseData.name, accountId);

      const [[sessionToken], [bookingId1], [bookingId2]] = await Promise.all([
        createMockSession(accountId, 1),
        createMockBooking(accountId, 3, 3, "pending", houseId),
        createMockBooking(accountId, 6, 3, "pending", houseId),
      ]);

      const response = await request(server)
        .get(`/bookings`)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.bookings).not.toBeUndefined();
      expect(response.body.bookings.length).toStrictEqual(2);
      expect(
        response.body.bookings[0].bookingId === bookingId1 || bookingId2,
      ).toBeTruthy();
      expect(
        response.body.bookings[1].bookingId === bookingId1 || bookingId2,
      ).toBeTruthy();
    });

    it("should return the bookings from all of the account's houses", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const [houseId1, houseId2] = await Promise.all([
        createMockHouse(mockHouseData.name, accountId), // House 1
        createMockHouse(mockHouseData2.name, accountId), // House 2
      ]);

      const [
        [sessionToken],
        [bookingId1],
        [bookingId2],
        [bookingId3],
      ] = await Promise.all([
        createMockSession(accountId, 1),
        createMockBooking(accountId, 3, 3, "pending", houseId1), // House 1 booking
        createMockBooking(accountId, 6, 3, "pending", houseId1), // House 1 booking
        createMockBooking(accountId, 6, 3, "pending", houseId2), // House 2 booking
      ]);

      const response = await request(server)
        .get(`/bookings`)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.bookings).not.toBeUndefined();
      expect(response.body.bookings.length).toStrictEqual(3);

      const responseBookingIds = response.body.bookings.map(
        (booking: BookingForClient) => booking.bookingId,
      );

      expect(responseBookingIds.includes(bookingId1)).toBeTruthy(); // House 1 booking
      expect(responseBookingIds.includes(bookingId2)).toBeTruthy(); // House 1 booking
      expect(responseBookingIds.includes(bookingId3)).toBeTruthy(); // House 2 booking
    });

    it("should not return the bookings of another account", async () => {
      const [[accountId1], [accountId2]] = await Promise.all([
        createMockAccount(
          mockNewAccountData.firstName,
          mockNewAccountData.lastName,
          mockNewAccountData.email,
          mockNewAccountData.password,
        ),
        createMockAccount(
          mockNewAccountData2.firstName,
          mockNewAccountData2.lastName,
          mockNewAccountData2.email,
          mockNewAccountData2.password,
        ),
      ]);

      const houseId = await createMockHouse(mockHouseData.name, accountId1);

      await addMockAccountToMockHouse(accountId2, houseId, false);

      const [
        [sessionToken],
        [bookingId1],
        [bookingId2],
        [bookingId3],
      ] = await Promise.all([
        createMockSession(accountId1, 1),
        createMockBooking(accountId1, 3, 3, "pending", houseId), // Account 1 booking
        createMockBooking(accountId1, 1, 3, "pending", houseId), // Account 1 booking
        createMockBooking(accountId2, 8, 3, "pending", houseId), // Account 2 booking
      ]);

      const response = await request(server)
        .get(`/bookings`)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.bookings).not.toBeUndefined();
      expect(response.body.bookings.length).toStrictEqual(2);

      const bookingIds = response.body.bookings.map(
        (booking: BookingForClient) => booking.bookingId,
      );
      expect(bookingIds.includes(bookingId1)).toBeTruthy();
      expect(bookingIds.includes(bookingId2)).toBeTruthy();
      expect(bookingIds.includes(bookingId3)).toBeFalsy(); // Account 2 booking
    });
  });

  describe("Get all the bookings in a given interval: /houses/:houseId/bookings", () => {
    it("should return bookings within the given interval", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const houseId = await createMockHouse(mockHouseData.name, accountId);

      const [[sessionToken], [bookingId1], [bookingId2]] = await Promise.all([
        createMockSession(accountId, 1),
        createMockBooking(accountId, 0, 3, "pending", houseId),
        createMockBooking(accountId, 0, 3, "pending", houseId),
      ]);

      const today = new Date();
      const intervalStart = startOfMonth(today);
      const intervalEnd = lastDayOfMonth(today);

      const response = await request(server)
        .get(`/houses/${houseId}/bookings`)
        .query({
          start: intervalStart,
          end: intervalEnd,
        })
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.bookings).not.toBeUndefined();
      expect(response.body.bookings.length).toStrictEqual(2);

      const bookingIds = response.body.bookings.map(
        (booking: BookingForClient) => booking.bookingId,
      );
      expect(bookingIds.includes(bookingId1)).toBeTruthy();
      expect(bookingIds.includes(bookingId2)).toBeTruthy();
    });

    it("should not return bookings outside the given interval", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const houseId = await createMockHouse(mockHouseData.name, accountId);

      const twoMonthsAwayDate = 65;

      const [[sessionToken], [bookingId1], [bookingId2]] = await Promise.all([
        createMockSession(accountId, 1),
        createMockBooking(accountId, 1, 3, "pending", houseId), // Inside interval booking
        createMockBooking(accountId, twoMonthsAwayDate, 3, "pending", houseId), // Outside interval booking
      ]);

      const today = new Date();

      const intervalStart = startOfMonth(today);
      const intervalEnd = lastDayOfMonth(today);

      const response = await request(server)
        .get(`/houses/${houseId}/bookings`)
        .query({
          start: intervalStart,
          end: intervalEnd,
        })
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.bookings).not.toBeUndefined();
      expect(response.body.bookings.length).toStrictEqual(1);

      const bookingIds = response.body.bookings.map(
        (booking: BookingForClient) => booking.bookingId,
      );
      expect(bookingIds.includes(bookingId1)).toBeTruthy(); // Inside interval booking
      expect(bookingIds.includes(bookingId2)).toBeFalsy(); // Outside interval booking
    });

    it("should not return bookings from another house", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const houseId1 = await createMockHouse(mockHouseData.name, accountId);
      const houseId2 = await createMockHouse(mockHouseData.name, accountId);

      const [[sessionToken], [bookingId1], [bookingId2]] = await Promise.all([
        createMockSession(accountId, 1),
        createMockBooking(accountId, 1, 3, "pending", houseId1), // First house booking
        createMockBooking(accountId, 1, 3, "pending", houseId2), // Second house booking
      ]);

      const today = new Date();

      const intervalStart = startOfMonth(today);
      const intervalEnd = lastDayOfMonth(today);

      const response = await request(server)
        .get(`/houses/${houseId1}/bookings`)
        .query({
          start: intervalStart,
          end: intervalEnd,
        })
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.bookings).not.toBeUndefined();
      expect(response.body.bookings.length).toStrictEqual(1);

      const bookingIds = response.body.bookings.map(
        (booking: BookingForClient) => booking.bookingId,
      );
      expect(bookingIds.includes(bookingId1)).toBeTruthy(); // First house booking
      expect(bookingIds.includes(bookingId2)).toBeFalsy(); // Second house booking
    });
  });

  describe("Update a booking: /bookings/:bookingId", () => {
    it("should update the booking with the new data", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData.firstName,
        mockNewAccountData.lastName,
        mockNewAccountData.email,
        mockNewAccountData.password,
      );

      const houseId = await createMockHouse(mockHouseData.name, accountId);

      const [[sessionToken], [bookingId]] = await Promise.all([
        createMockSession(accountId, 1),
        createMockBooking(accountId, 0, 3, "accepted", houseId),
      ]);

      const mockNewData = {
        comments: "Thanks for the slot!",
        companions: 1,
      };

      const response = await request(server)
        .put(`/bookings/${bookingId}`)
        .send(mockNewData)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      const updatedBookingRow = await knex("bookings")
        .where({
          booking_id: bookingId,
        })
        .first();

      expect(response.status).toStrictEqual(200);
      expect(updatedBookingRow.booking_id).toStrictEqual(bookingId);
      expect(updatedBookingRow.comments).toStrictEqual(mockNewData.comments);
      expect(updatedBookingRow.companions).toStrictEqual(1);
    });

    describe("when updated booking data is invalid", () => {
      it("should not update the booking and return 400", async () => {
        const [accountId] = await createMockAccount(
          mockNewAccountData.firstName,
          mockNewAccountData.lastName,
          mockNewAccountData.email,
          mockNewAccountData.password,
        );

        const houseId = await createMockHouse(mockHouseData.name, accountId);

        const [[sessionToken], [bookingId]] = await Promise.all([
          createMockSession(accountId, 1),
          createMockBooking(accountId, 0, 3, "accepted", houseId),
        ]);

        const mockInvalidNewData = {
          comments: 1232324,
          companions: "wrongdata",
        };

        const response = await request(server)
          .put(`/bookings/${bookingId}`)
          .send(mockInvalidNewData)
          .set("Cookie", [`laperette_session=${sessionToken}`]);

        const updatedBookingRow = await knex("bookings")
          .where({
            booking_id: bookingId,
          })
          .first();

        expect(response.status).toStrictEqual(400);
        expect(updatedBookingRow.booking_id).toStrictEqual(bookingId);
        expect(updatedBookingRow.comments).toStrictEqual("Eager to be there!");
        expect(updatedBookingRow.companions).toStrictEqual(2);
      });
    });
  });
});
