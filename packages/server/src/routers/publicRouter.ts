import * as Router from "koa-router";
import { createAccount } from "../controllers/accounts";
import { login } from "../controllers/auth";
import { validateCredentials } from "../middlewares/validateCredentials";

export const publicRouter = new Router();

publicRouter.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

publicRouter.post("/signup", createAccount);

publicRouter.post("/login", validateCredentials, login);
