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
  // Transform ESM modules from @cosmjs, @scure, @noble
  transformIgnorePatterns: ['node_modules/(?!(@cosmjs|@scure|@noble)/)'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: {
          allowJs: true,
          esModuleInterop: true,
        },
      },
    ],
  },
};
