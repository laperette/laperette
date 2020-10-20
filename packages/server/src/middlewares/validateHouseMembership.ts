import { Context } from "koa";
import { checkExistingMembership } from "../db/houses";

export const validateHouseMembership = async (
  ctx: Context,
  next: () => void,
) => {
  const { houseId } = ctx.params;
  const { accountId } = ctx.state;

  if (!accountId || !houseId) {
    ctx.status = 400;
    ctx.message = "Invalid house id";
    return;
  }

  const isHouseMember = await checkExistingMembership(accountId, houseId);

  if (!isHouseMember) {
    ctx.status = 403;
    ctx.message = "Unauthorized - User not a member of requested house";
    return;
  }

  return next();
};
