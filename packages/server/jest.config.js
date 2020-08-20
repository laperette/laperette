module.exports = {
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest.testSetup.ts"],
};
