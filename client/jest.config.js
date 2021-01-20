module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{vue, js}', '!**/node_modules/**', '!<rootDir>/dist/**', '!<rootDir>/src/plugins/**', '!<rootDir>/tests/unit/**'],
  coverageReporters: ['lcov', 'text-summary'],
  setupFiles: ['./tests/setup.js'],
};
