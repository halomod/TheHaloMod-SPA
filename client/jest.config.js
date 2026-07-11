module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testPathIgnorePatterns: [
    '<rootDir>/tests/unit/(?!Generic).*Form.spec.js',
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  /**
   * d3 7.x (and its d3-* sub-packages) ship as pure ESM, which Jest's
   * default CJS transform can't parse. This carves out an exception so
   * those packages still get transformed by babel-jest, instead of being
   * skipped like the rest of node_modules.
   */
  transformIgnorePatterns: [
    '/node_modules/(?!(d3|d3-array|d3-axis|d3-brush|d3-chord|d3-color|d3-contour|d3-delaunay|d3-dispatch|d3-drag|d3-dsv|d3-ease|d3-fetch|d3-force|d3-format|d3-geo|d3-hierarchy|d3-interpolate|d3-path|d3-polygon|d3-quadtree|d3-random|d3-scale|d3-scale-chromatic|d3-selection|d3-shape|d3-time|d3-time-format|d3-timer|d3-transition|d3-zoom|internmap|delaunator|robust-predicates)/)',
  ],
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
  setupFilesAfterEnv: ['./tests/setupAfterEnv.js'],
};
