import * as Knex from "knex";
import { addDays } from "date-fns";
import { hashPassword } from "../src/utils/auth";
export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw Error("Cannot seed data in production, aborting");
  }

  const seedDatabase = async () => {
    const createMockAccount = async (
      firstName: string,
      lastName: string,
      email: string,
      isMember: boolean,
      isAdmin: boolean,
    ): Promise<string> => {
      const dumbPassword = await hashPassword("password");
      const account = {
        first_name: firstName,
        last_name: lastName,
        email,
        is_member: isMember,
        is_admin: isAdmin,
        password: dumbPassword,
      };

      return knex.table("accounts").insert(account).returning("account_id");
    };

    // const createMockHouse = async (
    //   accountId: string,

    // ): Promise<string> => {
    //   const account = {
    //     first_name: firstName,
    //     last_name: lastName,
    //     email,
    //     is_member: isMember,
    //     is_admin: isAdmin,
    //     password: dumbPassword,
    //   };

    //   return knex.table("accounts").insert(account).returning("account_id");
    // };

    const createMockBooking = async (
      accountId: string,
      randomDate: number,
      stayLength: number,
      status: string,
    ): Promise<void> => {
      const today = new Date();
      const fakeBooking = {
        booker_id: accountId,
        arrival_time: addDays(today, randomDate),
        departure_time: addDays(today, randomDate + stayLength),
        comments: "Eager to be there!",
        companions: ["Alain Gerbault", "Olivier de Kersauson"],
        status,
      };

      return knex("bookings").insert(fakeBooking).returning("booking_id");
    };

    const clearTables = async () => {
      Promise.all([knex("accounts").del(), knex("bookings").del()]);
    };

    console.log("Clearing tables");
    await clearTables();
    console.log("Cleared tables");

    console.log("Inserting admin account");
    const [adminId] = await createMockAccount(
      "Eric",
      "Tabraly",
      "admin@gmail.com",
      true,
      true,
    );
    console.log(`Inserted admin account, accountId: ${adminId}`);
    console.log("Inserting member account");
    const [memberId] = await createMockAccount(
      "Bernard",
      "Moitessier",
      "member@gmail.com",
      true,
      false,
    );
    console.log(`Inserted member account, accountId: ${memberId}`);

    console.log("Inserting approved booking");
    const approvedBookingId = await createMockBooking(
      adminId,
      3,
      4,
      "approved",
    );
    console.log(`Inserted approved booking, bookingId: ${approvedBookingId}`);
    console.log("Inserting pending booking");
    const pendingBookingId = await createMockBooking(memberId, 0, 2, "pending");
    console.log(`Inserted pending booking, bookingId: ${pendingBookingId}`);
    console.log("Inserting rejected booking");
    const rejectedBookingId = await createMockBooking(
      memberId,
      -10,
      7,
      "rejected",
    );
    console.log(`Inserted rejected booking: ${rejectedBookingId}`);
  };

  try {
    await seedDatabase();
  } catch (error) {
    console.log(error);
  }
}
