import { format, parse } from "date-fns";
import range from "lodash/range";

export const getRandomIntegerInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const repeat = (length: number, ret: string) =>
  range(length).map(() => ret);

export const formatDate = (date: Date) => format(date, "EEEE dd MMM yyyy");

export const createNewDateFromString = (date: string): Date =>
  parse(date, "dd/MM/yyyy", new Date());
