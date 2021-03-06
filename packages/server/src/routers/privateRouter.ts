import Router = require("koa-router");
import {
  revokeAccountSessionById,
  getAccountSessions,
} from "../controllers/auth";
import {
  getAccountBooking,
  getAccountBookings,
  createBooking,
  updateBooking,
  getHouseBookingsByInterval,
  getHouseBooking,
  deleteBooking,
} from "../controllers/bookings";
import { getCurrentAccount } from "../controllers/accounts";
import {
  createHouse,
  getAccountHouses,
  addNewHouseMember,
  getAccountHouse,
} from "../controllers/houses";
import { authenticate } from "../middlewares/authenticate";
import { validateBookingOwnership } from "../middlewares/validateBookingOwnership";
import { validateHouseMembership } from "../middlewares/validateHouseMembership";

export const privateRouter = new Router();

privateRouter.use(authenticate);

privateRouter.post("/logout", revokeAccountSessionById);

privateRouter.get("/bookings", getAccountBookings);

privateRouter.get(
  "/bookings/:bookingId",
  validateBookingOwnership,
  getAccountBooking,
);

privateRouter.put(
  "/bookings/:bookingId",
  validateBookingOwnership,
  updateBooking,
);

privateRouter.del(
  "/bookings/:bookingId",
  validateBookingOwnership,
  deleteBooking,
);

privateRouter.get("/houses", getAccountHouses);

privateRouter.get("/houses/:houseId", validateHouseMembership, getAccountHouse);

privateRouter.post("/houses/house", createHouse);

privateRouter.post(
  "/houses/:houseId/bookings/booking",
  validateHouseMembership,
  createBooking,
);

privateRouter.get(
  "/houses/:houseId/bookings",
  validateHouseMembership,
  getHouseBookingsByInterval,
);

privateRouter.get(
  "/houses/:houseId/bookings/:bookingId",
  validateHouseMembership,
  getHouseBooking,
);

privateRouter.post(
  "/houses/:houseId/members/member",
  validateHouseMembership,
  addNewHouseMember,
);

privateRouter.get("/account/sessions", getAccountSessions);

privateRouter.get("/accounts/current", getCurrentAccount);
