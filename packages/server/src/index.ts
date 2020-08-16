import * as Koa from "koa";
import * as cors from "@koa/cors";
import { router } from "./router";
import * as bodyParser from "koa-bodyparser";
import { config } from "./config";

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(bodyParser());
app.use(router.routes());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});

app.on("error", (err) => {
  console.log(err);
});
