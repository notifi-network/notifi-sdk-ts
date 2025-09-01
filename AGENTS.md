# AGENTS.md

## Build, Lint, and Test

- Build all packages: `npm run build`
- Lint all code: `npm run lint`
- Format code: `npm run format`
- Test all packages: `npm run test`
- Test a single package: `npx lerna --scope=<package> run test`
- To run a single test file, use the package's npm scripts (e.g. `npm run test:auth-manager`)
- Add new tests in `__test__` directories

## Code Style Guidelines

- Use TypeScript and path aliases for imports
- Imports: third-party first, then relative; separated and sorted (Prettier enforced)
- Formatting: 80 char lines, semicolons, single quotes, trailing commas
- No unused vars (except \_-prefixed), warn on `any`
- Console usage is allowed; explicit module boundary types not required
- Prettier and ESLint are enforced on commit
- Use try/catch for error handling and log errors with context
- Use descriptive names for files, variables, and types
- Follow package-level README and contribution guidelines
