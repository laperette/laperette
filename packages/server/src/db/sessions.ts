import { knex } from "./db";

export const saveUserSession = async (
  accountId: string,
  token: string,
  expiryDate: Date,
) => {
  await knex("sessions").insert({
    account_id: accountId,
    session_id: token,
    expires_at: expiryDate,
  });
};

export const getActiveUserSessions = async (sessionId) => {
  return await knex("sessions")
    .where({
      session_id: sessionId,
    })
    .where("expires_at", ">", new Date())
    .orderBy("created_at", "DESC");
};

export const invalidateSessionById = async (sessionId) => {
  await knex("sessions").del().where({
    session_id: sessionId,
  });
};

// export const invalidateSessionByUser = async (sessionId) => {
//   await knex("sessions").del().where({
//     session_id: sessionId,
//   });
// };
