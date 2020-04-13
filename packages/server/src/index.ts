import * as Koa from "koa";
import * as Router from "koa-router";
import * as cors from "@koa/cors";

import { getBookingById } from "./db";

const app = new Koa();
const router = new Router();

app.use(cors({ origin: "*" }));

router.get("/booking", async (ctx) => {
  const booking = await getBookingById("1");
  ctx.body = booking;
});

router.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

app.use(router.routes());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
