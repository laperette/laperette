module.exports = {
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/dist/", "/node_modules/", "/migrations/"],
  globalSetup: "<rootDir>/jest.globalSetup.ts",
};
