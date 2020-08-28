import { addDays } from "date-fns";
import { knex } from "../db/db";
import { hashPassword } from "../utils/auth";

const seedDatabase = async () => {
  const createSeedingAccount = async (
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

  const createSeedingBooking = async (
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

  console.log("Inserting account");
  const [adminId] = await createSeedingAccount(
    "Eric",
    "Tabraly",
    "admin@gmail.com",
    true,
    true,
  );
  console.log("Inserted account");
  console.log("Inserting account");
  const [memberId] = await createSeedingAccount(
    "Bernard",
    "Moitessier",
    "member@gmail.com",
    true,
    false,
  );
  console.log("Inserted account");

  console.log("Inserting booking");
  await createSeedingBooking(adminId, 3, 4, "approved");
  console.log("Inserted booking");
  console.log("Inserting booking");
  await createSeedingBooking(memberId, 0, 2, "pending");
  console.log("Inserted booking");
  console.log("Inserting booking");
  await createSeedingBooking(memberId, -10, 7, "rejected");
  console.log("Inserted booking");
  return;
};

try {
  seedDatabase();
} catch (error) {
  console.log(error);
}
