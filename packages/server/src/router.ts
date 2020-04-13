import * as Router from "koa-router";

import { getBooking, getBookings } from "./controllers/bookings";

export const router = new Router();

router.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

router.get("/bookings", getBookings);

router.get("/bookings/:bookingId", getBooking);