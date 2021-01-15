module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{vue}', '!**/node_modules/**', '!<rootDir>/dist/**', '!<rootDir>/src/plugins/**', '!<rootDir>/tests/unit/**'],
  coverageReporters: ['lcov', 'text-summary'],
  setupFiles: ['./__tests__/setup.js'],
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/setup.js"
  ],
};
