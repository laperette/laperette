import * as Router from "koa-router";

import {
  getBooking,
  getBookingsByInterval,
  createBooking,
  updateBooking,
} from "./controllers/bookings";
import {
  createAccount,
  getAccount,
  getCurrentAccount,
} from "./controllers/accounts";
import { validateCreateAccountData } from "./middlewares/validate";
import {
  login,
  revokeAccountSessionById,
  listAccountSessions,
} from "./controllers/auth";
import { authenticate, validateCredentials } from "./middlewares/authenticate";

export const router = new Router();

router.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

router.post("/signup", validateCreateAccountData, createAccount);

router.post("/login", validateCredentials, login);

router.post("/logout", authenticate, revokeAccountSessionById);

router.get("/bookings", authenticate, getBookingsByInterval);

router.get("/bookings/:bookingId", authenticate, getBooking);

router.get("/accounts/current", getCurrentAccount);

router.get("/accounts/:accountId", authenticate, getAccount);

router.get("/accounts/:accountId/sessions", authenticate, listAccountSessions);

router.post("/accounts/:accountId/booking", authenticate, createBooking);

router.post(
  "/accounts/:accountId/booking/:bookingId",
  authenticate,
  updateBooking,
);
