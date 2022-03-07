export const userFragment = `
fragment userFragment on User {
  email
  emailConfirmed
  authorization {
    token
    expiry
  }
}
`.trim();

export const userFragmentDependencies = [];
