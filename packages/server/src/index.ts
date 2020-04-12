import * as Koa from "koa";
import * as cors from "@koa/cors";

const app = new Koa();
app.use(cors({ origin: "*" }));
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

app.listen(8000);
