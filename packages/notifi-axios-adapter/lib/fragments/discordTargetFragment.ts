export const discordTargetFragment = `
fragment discordTargetFragment on DiscordTarget {
  id
  discordAccountId
  discriminator
  isConfirmed
  username
  name
  userStatus
  verificationLink
  discordServerInviteLink
}
`.trim();

export const discordTargetFragmentDependencies = [];
