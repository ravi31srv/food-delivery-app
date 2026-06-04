/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: {
        module: "CommonJS",
        moduleResolution: "node",
        esModuleInterop: true,
        ignoreDeprecations: "6.0",
      },
    }],
  },
  moduleNameMapper: {
    // remap .js imports to no extension so Jest finds the .ts file
    "^(\\./.*)\\.js$": "$1",
    "^(\\.\\./.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/jest.setup.ts"],
  forceExit: true,
};
