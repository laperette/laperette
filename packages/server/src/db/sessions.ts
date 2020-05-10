import { knex } from "./db";

export const saveAccountSession = async (
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
export const getActiveAccountSession = async (sessionId) => {
  return await knex("sessions")
    .where({
      session_id: sessionId,
    })
    .where("expires_at", ">", new Date())
    .orderBy("created_at", "DESC");
};

export const invalidateSessionById = async (sessionId: string) => {
  await knex("sessions").del().where({
    session_id: sessionId,
  });
};

export const invalidateSessionByUser = async (accountId) => {
  await knex("sessions").del().where({
    account_id: accountId,
  });
};

export const getSessionsByUser = async (accountId) => {
  const accountSessions = await knex("sessions").where({
    account_id: accountId,
  });
  return accountSessions;
};

export const getSessionsById = async (sessionId) => {
  const session = await knex("sessions").where({
    session_id: sessionId,
  });
  return session;
};

// To be done, leaving here not to forget
// export const invalidateSessionByAccount = async (sessionId) => {
//   await knex("sessions").del().where({
//     session_id: sessionId,
//   });
// };
