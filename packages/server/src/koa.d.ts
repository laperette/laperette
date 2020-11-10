/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "koa";

declare module "koa" {
  interface Request {
    body?: any;
  }
}
