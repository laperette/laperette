import { zeros, repeat } from "./utils";

describe("utils", () => {
  describe("zeros", () => {
    it("should return an array filled of zeros", () => {
      expect(zeros(3)).toStrictEqual([0, 0, 0]);
    });
  });
  describe("repeat", () => {
    it("should return an array filled with the given string", () => {
      expect(repeat(3, "str")).toStrictEqual(["str", "str", "str"]);
    });
  });
});
