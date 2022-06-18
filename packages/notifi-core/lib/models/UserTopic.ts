/**
 * UserTopic for creator messaging
 *
 * @remarks
 * UserTopic for creator messaging
 *
 * @property {string | null} name - Display name (must be unique)
 * @property {string | null} topicName - The identifier used by users to subscribe to this topic
 * @property {ReadonlyArray<string> | null} targetCollections - The update authority of the collectiosn to identify holders
 * @property {string | null} targetTemplate - The name of the template configured for use with this topic
 *
 */

export type UserTopic = Readonly<{
  name: string | null;
  topicName: string | null;
  targetCollections: ReadonlyArray<string> | null;
  targetTemplate: string | null;
}>;
