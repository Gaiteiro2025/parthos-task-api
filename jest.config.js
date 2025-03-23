module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "src/main.ts",
    "src/app.module.ts",
    "src/ormconfig.ts",
    "src/ormconfig.test.ts",
    "src/filters/all-exceptions.filter.ts",
    "src/common/handle.error.ts"
    
  ],
  collectCoverageFrom: [
    "**/*.(t|j)s",
    "!**/*.mock.(t|j)s",
    "!**/*.constants.(t|j)s",
    "!**/*.strategy.(t|j)s",
    "!**/*-auth.guard.(t|j)s",
    "!**/*.module.(t|j)s",
    "!**/migrations/*.(t|j)s"
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
