import { emptyTheDatabase } from "./utils";

afterEach(() => {
  return emptyTheDatabase();
});
