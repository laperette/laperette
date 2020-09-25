import * as Router from "koa-router";
import { createAccount } from "../controllers/accounts";
import { login } from "../controllers/auth";
import { validateCreateAccountData } from "../middlewares/validate";
import { validateCredentials } from "../middlewares/validateCredentials";

export const publicRouter = new Router();

publicRouter.get("/healthz", (ctx) => {
  ctx.body = { ok: true };
});

publicRouter.post("/signup", validateCreateAccountData, createAccount);

publicRouter.post("/login", validateCredentials, login);
