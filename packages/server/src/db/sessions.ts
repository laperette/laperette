import { knex } from "./db";
import { Session } from "../types/auth";

export const insertAccountSession = async (
  accountId: string,
  expiryDate: Date,
): Promise<string[]> => {
  return await knex("sessions")
    .insert({
      account_id: accountId,
      expires_at: expiryDate,
    })
    .returning("session_id");
};

export const retrieveActiveSession = async (
  sessionId: string,
): Promise<Session> => {
  return knex("sessions")
    .where({
      session_id: sessionId,
    })
    .andWhere("expires_at", ">", new Date())
    .first();
};

export const invalidateSessionById = async (
  sessionId: string,
): Promise<void> => {
  knex("sessions").del().where({
    session_id: sessionId,
  });
};

export const invalidateSessionByUser = async (
  accountId: string,
): Promise<void> => {
  knex("sessions").del().where({
    account_id: accountId,
  });
};

export const retrieveSessionsByUser = async (
  accountId: string,
): Promise<Session[]> => {
  return knex("sessions").where({
    account_id: accountId,
  });
};

export const retrieveSessionById = async (
  sessionId: string,
): Promise<Session> => {
  return knex("sessions")
    .where({
      session_id: sessionId,
    })
    .first();
};

// Router + Controller to be created, leaving here not to forget
// export const invalidateSessionByAccount = async (sessionId:string) => {
//   await knex("sessions").del().where({
//     session_id: sessionId,
//   });
// };
