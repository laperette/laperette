import * as Koa from "koa";
import * as cors from "@koa/cors";
import { router } from "./router";
import * as bodyParser from "koa-bodyparser";
import { config } from "./config";

const app = new Koa();

app.use(async (ctx: Koa.Context, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.message = error.message;
    ctx.app.emit("error", error, ctx);
  }
});

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(bodyParser());
app.use(router.routes());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
