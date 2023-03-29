export const discordTargetFragment = `
fragment discordTargetFragment on DiscordTarget {
  id
  discordAccountId
  discriminator
  isConfirmed
  username
  name
}
`.trim();

export const discordTargetFragmentDependencies = [];
