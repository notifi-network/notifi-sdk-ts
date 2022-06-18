import {
  authorizationFragment,
  authorizationFragmentDependencies,
} from './authorizationFragment';

export const userFragment = `
fragment userFragment on User {
  email
  emailConfirmed
  authorization {
    ...authorizationFragment
  }
  roles
}
`.trim();

export const userFragmentDependencies = [
  ...authorizationFragmentDependencies,
  authorizationFragment,
];
