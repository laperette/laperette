import * as Koa from "koa";
import * as Router from "koa-router";
import * as cors from "@koa/cors";

import { getBooking } from "./db";

const app = new Koa();
const router = new Router();

app.use(cors({ origin: "*" }));
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

// router.get("/booking", () => {
//   const booking = getBooking("1");
// });

router.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

app.use(router.routes());

app.listen(process.env.PORT || 8000);
