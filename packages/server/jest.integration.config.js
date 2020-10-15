const config = require("./jest.unit.config");

module.exports = {
  ...config,
  globalSetup: "<rootDir>/src/setupTests/integrationSetup.ts",
  globalTeardown: "<rootDir>/src/setupTests/integrationTeardown.ts",
  testRegex: ".*.integration.test.ts",
};
