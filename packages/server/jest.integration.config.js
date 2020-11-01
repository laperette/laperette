const config = require("./jest.unit.config");

module.exports = {
  ...config,
  testRegex: ".*.integration.test.ts",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests/setupAfterEnv.ts"],
};
