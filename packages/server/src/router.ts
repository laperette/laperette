import * as Router from "koa-router";

import { getBooking, getBookings } from "./controllers/bookings";
import { createAccount, getAccount } from "./controllers/accounts";
import { validateCreateAccountBody } from "./middlewares/validate";
import {
  login,
  revokeAccountSessionById,
  listAccountSessions,
} from "./controllers/auth";
import { authenticate } from "./middlewares/authenticate";

export const router = new Router();

router.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

router.get("/bookings", authenticate, getBookings);

router.get("/bookings/:bookingId", authenticate, getBooking);

router.post("/accounts", validateCreateAccountBody, createAccount);

router.get("/accounts/:accountId", authenticate, getAccount);

router.get("/accounts/:accountId/sessions", authenticate, listAccountSessions);

router.delete("/accounts/:sessionId", authenticate, revokeAccountSessionById);

router.post("/login", login);
