import * as Koa from "koa";
import * as cors from "@koa/cors";
import { router } from "./router";
import * as bodyParser from "koa-bodyparser";

const app = new Koa();

app.use(cors({ origin: "*" }));
app.use(bodyParser());
app.use(router.routes());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started. Listening on port ${port}`);
});
