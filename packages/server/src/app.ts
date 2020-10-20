import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { config } from "./config";
import { publicRouter } from "./routers/publicRouter";
import { privateRouter } from "./routers/privateRouter";

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
app.use(publicRouter.routes());
app.use(privateRouter.routes());

export default app;
