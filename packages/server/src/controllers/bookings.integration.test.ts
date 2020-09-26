import { setupTestRouter } from "../testSetup/setupTestRouter";

import * as net from "net";
import * as supertest from "supertest";
import {
  createMockAccount,
  createMockHouse,
  createMockSession,
} from "../utils/tests";
import { knex } from "../db/db";
import { addDays } from "date-fns";

const app = setupTestRouter();
let server: net.Server;

beforeEach(() => {
  server = app.listen();
});

afterEach(() => {
  server.close();
});

describe("Create a booking: /houses/:houseId/bookings/booking", () => {
  it("should create and return a booking", async () => {
    const mockNewAccountData = {
      firstName: "Eric",
      lastName: "Tabarly",
      email: "admin@gmail.com",
      password: "password",
    };

    const mockHouseData = {
      name: "Longwood House",
    };

    const [accountId] = await createMockAccount(
      mockNewAccountData.firstName,
      mockNewAccountData.lastName,
      mockNewAccountData.email,
      mockNewAccountData.password,
    );

    const houseId = await createMockHouse(mockHouseData.name, accountId);

    const mockBookingData = {
      arrivalTime: addDays(new Date(), 1),
      departureTime: addDays(new Date(), 5),
      comments: "Eager to be there!",
      companions: ["Alain Gerbault", "Olivier de Kersauson"],
    };

    const sessionToken = await createMockSession(accountId, 1);

    const response = await supertest(server)
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
});
