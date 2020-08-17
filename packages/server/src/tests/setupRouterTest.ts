import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import { router } from "../router";

export const setupTest = () => {
  const app = new Koa();
  app.use(async (ctx, next) => {
    console.log({ ctx });

    try {
      await next();
    } catch (err) {
      console.log("An unexpected error occured", err);
      ctx.status = err.status || 500;
      ctx.body = err.message;
      return;
    }
  });
  app.use(bodyParser());
  app.use(router.routes());
  const server = app.callback();
  return server;
};
