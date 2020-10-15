import { Context } from "koa";
import { checkExistingMembership } from "../db/houses";

export const validateHouseMembership = async (
  ctx: Context,
  next: () => void,
) => {
  const { houseId } = ctx.params;
  const { accountId } = ctx.state;

  if (!accountId || !houseId) {
    ctx.throw(404, "Not found");
  }

  const isHouseMember = await checkExistingMembership(accountId, houseId);

  if (!isHouseMember) {
    ctx.throw(401, "Unauthorized - User not a member of requested house");
  }

  return next();
};
