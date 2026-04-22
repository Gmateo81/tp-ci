export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  setupFilesAfterEnv: ["./tests/setup.ts"],
  forceExit: true,
  modulePaths: ["<rootDir>/backend/node_modules"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
};
