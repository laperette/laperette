import { knex } from "./db";

export const insertAccountSession = async (
  accountId: string,
  expiryDate: Date,
): Promise<string> => {
  return await knex("sessions")
    .insert({
      account_id: accountId,
      expires_at: expiryDate,
    })
    .returning("session_id");
};
export const retrieveActiveSession = async (sessionId: string) => {
  return await knex("sessions")
    .where({
      session_id: sessionId,
    })
    .where("expires_at", ">", new Date())
    .first();
};

export const retrieveAccountBySessionId = async (sessionId: string) => {
  return await knex("accounts")
    .join("sessions", "accounts.account_id", "sessions.account_id")
    .select("accounts.first_name", "accounts.last_name")
    .where({
      session_id: sessionId,
    })
    .first();
};

export const invalidateSessionById = async (sessionId: string) => {
  await knex("sessions").del().where({
    session_id: sessionId,
  });
};

export const invalidateSessionByUser = async (accountId: string) => {
  await knex("sessions").del().where({
    account_id: accountId,
  });
};

export const retrieveSessionsByUser = async (accountId: string) => {
  const accountSessions = await knex("sessions").where({
    account_id: accountId,
  });
  return accountSessions;
};

export const retrieveSessionsById = async (sessionId: string) => {
  const session = await knex("sessions").where({
    session_id: sessionId,
  });
  return session;
};

// To be done, leaving here not to forget
// export const invalidateSessionByAccount = async (sessionId:string) => {
//   await knex("sessions").del().where({
//     session_id: sessionId,
//   });
// };
