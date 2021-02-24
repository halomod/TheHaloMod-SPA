module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testPathIgnorePatterns: [
    "<rootDir>/tests/unit/.*Form.spec.js",
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,vue}',
    '!**/node_modules/**',
    '!<rootDir>/dist/**',
    '!<rootDir>/src/plugins/**',
    '!<rootDir>/tests/unit/**',
  ],
  coverageReporters: ['lcov', 'text-summary'],
  setupFiles: ['./tests/setup.js'],
  setupFilesAfterEnv: ['./tests/immutables.js'],
};
