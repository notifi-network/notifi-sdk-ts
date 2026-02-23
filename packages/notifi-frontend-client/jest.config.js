module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['.'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 10000, // 10 seconds
  transformIgnorePatterns: ['node_modules/(?!(@cosmjs|@scure|@noble)/)'],
  globals: {
    'ts-jest': {
      tsconfig: {
        allowJs: true,
        esModuleInterop: true,
      },
    },
  },
  moduleNameMapper: {
    '^@scure/(.*)$': '<rootDir>/node_modules/@scure/$1',
    '^@noble/(.*)$': '<rootDir>/node_modules/@noble/$1',
  },
};
