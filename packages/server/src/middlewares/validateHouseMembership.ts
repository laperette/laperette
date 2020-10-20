import { Context } from "koa";
import { validateMembership } from "../db/houses";

export const validateHouseMembership = async (
  ctx: Context,
  next: () => void,
) => {
  const { houseId } = ctx.params;
  const { accountId } = ctx.state;

  if (!accountId || !houseId) {
    ctx.status = 401;
    ctx.message = "Unauthorized";
    return;
  }

  const isHouseMember = await validateMembership(accountId, houseId);

  if (!isHouseMember) {
    ctx.status = 401;
    ctx.message = "Unauthorized - User not a member of requested house";
    return;
  }

  return next();
};
