import * as Koa from "koa";
import { router } from "../router";

export const setupTest = () => {
  const app = new Koa().use(router.routes());
  const server = app.callback();
  return server;
};
