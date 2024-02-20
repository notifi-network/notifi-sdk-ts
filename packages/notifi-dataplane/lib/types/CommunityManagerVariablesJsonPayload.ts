/**
 * The variable shape that is used for publishing Fusion messages
 * to Community Manager topics in `publishFusionMessage()`, used as
 * the `variablesJson` field in `FusionMessage`
 */
export type CommunityManagerVariablesJsonPayload = {
  Platform: CommunityManagerTargetVariables;
} & {
  [key in CommunityManagerOptionalTargetType]?: CommunityManagerTargetVariables;
};

/**
 * An additional target type to send the Community Manager message to
 */
export type CommunityManagerOptionalTargetType =
  | 'Sms'
  | 'Telegram'
  | 'Discord'
  | 'Email';

/**
 * The set of variables provided for each target in Community manager messages
 */
export type CommunityManagerTargetVariables = {
  /**
   * The subject line for the message, if applicable
   */
  subject?: string;
  /**
   * The message, in either HTML or plain text
   */
  message?: string;
  /**
   * The message in Markdown format. If provided, will override `message`
   */
  message__markdown?: string;
  /**
   * Additional data to be provided with the message
   */
  [key: string]: string | undefined;
};
