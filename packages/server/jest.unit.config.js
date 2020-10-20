module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests/setupAfterEnv.ts"],
  testRegex: ".*(?<!integration).test.ts",
};
