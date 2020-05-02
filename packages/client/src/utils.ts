export const zeros = (length: number) => Array.from(Array(length)).map(() => 0);
export const repeat = (length: number, ret: string) =>
  zeros(length).map(() => ret);
