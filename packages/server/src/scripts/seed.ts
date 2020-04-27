import { Booking } from "../domain";
import { addDays } from "date-fns";
import { knex } from "../db";

const seedDatabase = async () => {
  const today = new Date();
  const duration = 5;
  const booking = new Booking({
    end_date: addDays(today, duration),
    name: "Christophe",
    start_date: today,
    surname: "Martin",
  });
  console.log("Inserting", booking);
  const result = await knex.table("bookings").insert(booking);
  console.log("Inserted", result);
};

seedDatabase();
