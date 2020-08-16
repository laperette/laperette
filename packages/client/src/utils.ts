import range from "lodash/range";

export const repeat = (length: number, ret: string) =>
  range(length).map(() => ret);
