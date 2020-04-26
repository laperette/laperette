import * as Router from "koa-router";

import { getBooking, getBookings } from "./controllers/bookings";
import { createAccount, getAccount } from "./controllers/accounts";
import { validateCreateAccountBody } from "./middlewares/validate";

export const router = new Router();

router.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

router.get("/bookings", getBookings);

router.get("/bookings/:bookingId", getBooking);

router.post("/accounts", validateCreateAccountBody, createAccount);

router.get("/accounts/:accountId", getAccount);
