module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
    './**/*.ts',
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    coverageReporters: ['html', 'text', 'lcov'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/',
      '/swagger/',
      '/src/'
    ],
  };
  