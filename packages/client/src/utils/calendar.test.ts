import { repeat } from "./calendar";

describe("utils", () => {
  describe("repeat", () => {
    it("should return an array filled with the given string", () => {
      expect(repeat(3, "str")).toStrictEqual(["str", "str", "str"]);
    });
  });
});
