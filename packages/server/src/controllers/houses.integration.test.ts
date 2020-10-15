import {
  createMockAccount,
  createMockHouse,
  createMockSession,
} from "../utils/tests";

import * as request from "supertest";
import { knex } from "../db/db";
import { HouseForClient } from "../types/houses";
import app from "../app";
import { Server } from "http";

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

const mockNewAccountData3 = {
  firstName: "Olivier",
  lastName: "de Kersauson",
  email: "kersauzon@gmail.com",
  password: "password",
};

const mockHouseData1 = {
  name: "Longwood House",
};

const mockInvalidHouseData = {
  name: "    ",
};

const mockHouseData2 = {
  name: "La Confiance",
};

let server: Server;

beforeAll(async () => {
  server = await app.listen();
});

afterAll(() => {
  server.close();
});

describe("Houses", () => {
  describe("Create a house: /houses/house", () => {
    it("should create a house and a house admin membership for the account", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const [sessionToken] = await createMockSession(accountId, 1);

      const response = await request(server)
        .post(`/houses/house`)
        .send(mockHouseData1)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      const newHouseRow = await knex("houses")
        .where({
          name: mockHouseData1.name,
        })
        .first();

      const newHouseMembershipRow = await knex("house_memberships")
        .where({
          house_id: newHouseRow.house_id,
          account_id: accountId,
          is_admin: true,
        })
        .first();

      expect(response.status).toStrictEqual(201);
      expect(response.body.houseId).not.toBeUndefined();
      expect(response.body.houseId).toStrictEqual(newHouseRow.house_id);
      expect(newHouseMembershipRow).not.toBeUndefined();
    });
    describe("when new house data is invalid", () => {
      it("should not create a house", async () => {
        const [accountId] = await createMockAccount(
          mockNewAccountData1.firstName,
          mockNewAccountData1.lastName,
          mockNewAccountData1.email,
          mockNewAccountData1.password,
        );

        const [sessionToken] = await createMockSession(accountId, 1);

        const response = await request(server)
          .post(`/houses/house`)
          .send(mockInvalidHouseData)
          .set("Cookie", [`laperette_session=${sessionToken}`]);

        const newHouseRow = await knex("houses")
          .where({
            name: mockInvalidHouseData.name,
          })
          .first();

        const newHouseMembershipRow = await knex("house_memberships")
          .where({
            account_id: accountId,
          })
          .first();

        expect(response.status).toStrictEqual(400);
        expect(response.body.houseId).toBeUndefined();
        expect(newHouseRow).toBeUndefined();
        expect(newHouseMembershipRow).toBeUndefined();
      });
    });
  });

  describe("Get every houses of an account: /houses", () => {
    it("should return every houses where the account is a member", async () => {
      const [accountId] = await createMockAccount(
        mockNewAccountData1.firstName,
        mockNewAccountData1.lastName,
        mockNewAccountData1.email,
        mockNewAccountData1.password,
      );

      const [houseId1, houseId2] = await Promise.all([
        createMockHouse(mockHouseData1.name, accountId),
        createMockHouse(mockHouseData2.name, accountId),
      ]);

      const [sessionToken] = await createMockSession(accountId, 1);

      const response = await request(server)
        .get(`/houses`)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.houses).not.toBeUndefined();
      expect(response.body.houses.length).toStrictEqual(2);

      const houseIds = response.body.houses.map(
        (house: HouseForClient) => house.houseId,
      );

      expect(houseIds.includes(houseId1)).toBeTruthy();
      expect(houseIds.includes(houseId2)).toBeTruthy();
    });

    it("should not return houses from another account", async () => {
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

      const [houseId1, houseId2] = await Promise.all([
        createMockHouse(mockHouseData1.name, accountId1), // Account 1 house
        createMockHouse(mockHouseData1.name, accountId2), // Account 2 house
      ]);

      const [sessionToken] = await createMockSession(accountId1, 1); // Account 1 session

      const response = await request(server)
        .get(`/houses`)
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      expect(response.status).toStrictEqual(200);
      expect(response.body.houses).not.toBeUndefined();
      expect(response.body.houses.length).toStrictEqual(1);

      const houseIds = response.body.houses.map(
        (house: HouseForClient) => house.houseId,
      );

      expect(houseIds.includes(houseId1)).toBeTruthy(); // Account 1 house
      expect(houseIds.includes(houseId2)).toBeFalsy(); // Account 2 house
    });
  });

  describe("Add a new house member: /houses/:houseId/members/member", () => {
    it("should create a new house membership and return 201", async () => {
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

      const houseId1 = await createMockHouse(mockHouseData1.name, accountId1);

      const [sessionToken] = await createMockSession(accountId1, 1);

      const response = await request(server)
        .post(`/houses/${houseId1}/members/member`)
        .send({
          newMemberEmail: mockNewAccountData2.email,
        })
        .set("Cookie", [`laperette_session=${sessionToken}`]);

      const newMembershipRow = await knex("house_memberships")
        .where({
          account_id: accountId2,
          house_id: houseId1,
        })
        .first();

      expect(response.status).toStrictEqual(201);
      expect(newMembershipRow).not.toBeUndefined();
    });

    describe("When new member account does not exist yet", () => {
      it("should not create a new membership and return an error", async () => {
        const [accountId1] = await createMockAccount(
          mockNewAccountData1.firstName,
          mockNewAccountData1.lastName,
          mockNewAccountData1.email,
          mockNewAccountData1.password,
        );

        const houseId1 = await createMockHouse(mockHouseData1.name, accountId1);

        const [sessionToken] = await createMockSession(accountId1, 1);

        const response = await request(server)
          .post(`/houses/${houseId1}/members/member`)
          .send({
            newMemberEmail: mockNewAccountData2.email,
          })
          .set("Cookie", [`laperette_session=${sessionToken}`]);

        const newMembershipRow = await knex("house_memberships")
          .whereNot({ account_id: accountId1 })
          .first();

        expect(response.status).toStrictEqual(400);
        expect(newMembershipRow).toBeUndefined();
      });
    });
    describe("When the house does not exist", () => {
      it("should not create a new membership and return an error", async () => {
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

        const invalidHouseId = "e9547d52-a371-458e-a3e6-40729417299d";

        const [sessionToken] = await createMockSession(accountId1, 1);

        const response = await request(server)
          .post(`/houses/${invalidHouseId}/members/member`)
          .send({
            newMemberEmail: mockNewAccountData2.email,
          })
          .set("Cookie", [`laperette_session=${sessionToken}`]);

        const newMembershipRow = await knex("house_memberships")
          .where({ account_id: accountId2 })
          .first();

        expect(response.status).toStrictEqual(401);
        expect(newMembershipRow).toBeUndefined();
      });
    });
    describe("When the logged in account is not a house administrator", () => {
      it("should not create a new membership and return an error", async () => {
        const [[accountId1], [accountId2], [accountId3]] = await Promise.all([
          // House admin
          createMockAccount(
            mockNewAccountData1.firstName,
            mockNewAccountData1.lastName,
            mockNewAccountData1.email,
            mockNewAccountData1.password,
          ),
          // Desired new house member
          createMockAccount(
            mockNewAccountData2.firstName,
            mockNewAccountData2.lastName,
            mockNewAccountData2.email,
            mockNewAccountData2.password,
          ),
          // Logged in account, member but not admin
          createMockAccount(
            mockNewAccountData3.firstName,
            mockNewAccountData3.lastName,
            mockNewAccountData3.email,
            mockNewAccountData3.password,
          ),
        ]);

        const houseId1 = await createMockHouse(mockHouseData1.name, accountId1);

        await knex("house_memberships").insert({
          account_id: accountId3,
          house_id: houseId1,
          is_admin: false,
        });

        const [sessionToken] = await createMockSession(accountId3, 1); // Logged in account not admin

        const response = await request(server)
          .post(`/houses/${houseId1}/members/member`)
          .send({
            newMemberEmail: mockNewAccountData2.email,
          })
          .set("Cookie", [`laperette_session=${sessionToken}`]);

        const newMembershipRow = await knex("house_memberships")
          .where({ account_id: accountId2 })
          .first();

        expect(response.status).toStrictEqual(403);
        expect(newMembershipRow).toBeUndefined();
      });
    });
    describe("When the new member is already a house member", () => {
      it("should not create a new membership and return an error", async () => {
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

        const houseId1 = await createMockHouse(mockHouseData1.name, accountId1);

        await knex("house_memberships").insert({
          account_id: accountId2,
          house_id: houseId1,
          is_admin: false,
        });

        const [sessionToken] = await createMockSession(accountId1, 1);

        const response = await request(server)
          .post(`/houses/${houseId1}/members/member`)
          .send({
            newMemberEmail: mockNewAccountData2.email,
          })
          .set("Cookie", [`laperette_session=${sessionToken}`]);

        expect(response.status).toStrictEqual(409);
      });
    });
  });
});
