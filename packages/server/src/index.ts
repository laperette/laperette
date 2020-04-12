import * as Koa from "koa";
import * as Router from "koa-router";
import * as cors from "@koa/cors";

import { getBooking } from "./db";

const app = new Koa();
const routes = new Router();

app.use(cors({ origin: "*" }));
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

// routes.get("/booking", () => {
//   const booking = getBooking("1");
// });

app.use(routes);

app.listen(8000);
