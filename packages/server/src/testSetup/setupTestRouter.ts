import * as Koa from "koa";
import * as net from "net";
import * as bodyParser from "koa-bodyparser";
import { logger } from "../logger";
import { privateRouter } from "../routers/privateRouter";
import { publicRouter } from "../routers/publicRouter";

export const setupTestRouter = () => {
  const app = new Koa();
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error("An unexpected error occured", err);
      ctx.status = err.status || 500;
      ctx.body = err.message;
      return;
    }
  });
  app.use(bodyParser());
  app.use(privateRouter.routes());
  app.use(publicRouter.routes());
  return app;
};

export const closeServer = async (server: net.Server) => {
  server.close();
};
