// import { Booking } from "../domain";
// import { addDays } from "date-fns";
// import { knex } from "../db/db";

// const serializeBooking = (booking: Booking) => ({
//   end_date: booking.endDate,
//   start_date: booking.startDate,
//   first_name: booking.firstName,
//   last_name: booking.lastName,
// });

// const seedDatabase = async () => {
//   const today = new Date();
//   const duration = 5;
//   const booking = new Booking({
//     endDate: addDays(today, duration),
//     firstName: "Christophe",
//     startDate: today,
//     lastName: "Martin",
//   });
//   console.log("Inserting", booking);
//   const result = await knex.table("bookings").insert(serializeBooking(booking));
//   console.log("Inserted", result);
// };

// seedDatabase();
