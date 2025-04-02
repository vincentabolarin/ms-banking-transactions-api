export default {
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testMatch: ["**/src/**/*.test.ts"],
  testTimeout: 10000,
  maxWorkers: 1,
};
