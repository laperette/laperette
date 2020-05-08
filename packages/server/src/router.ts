import * as Router from "koa-router";

import { getBooking, getBookings } from "./controllers/bookings";
import { createAccount, getAccount } from "./controllers/accounts";
<<<<<<< HEAD
import { validateCreateAccountData } from "./middlewares/validate";
import {
  login,
  revokeAccountSessionById,
  listAccountSessions,
} from "./controllers/auth";
=======
import { validateCreateAccountBody } from "./middlewares/validate";
import { login } from "./controllers/auth";
>>>>>>> Created middleware to validate credentials + Added password hashing and insertion into DB
import { authenticate, validateCredentials } from "./middlewares/authenticate";

export const router = new Router();

router.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

router.get("/bookings", authenticate, getBookings);

router.get("/bookings/:bookingId", authenticate, getBooking);

router.post("/accounts", validateCreateAccountData, createAccount);

router.get("/accounts/:accountId", authenticate, getAccount);

<<<<<<< HEAD
router.get("/accounts/:accountId/sessions", authenticate, listAccountSessions);

router.delete("/accounts/:sessionId", authenticate, revokeAccountSessionById);

=======
>>>>>>> Created middleware to validate credentials + Added password hashing and insertion into DB
router.post("/login", validateCredentials, login);
