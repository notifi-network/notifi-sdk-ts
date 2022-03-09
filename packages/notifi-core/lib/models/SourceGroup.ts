/**
 * Object describing a SourceGroup
 *
 * @remarks
 * Object describing a SourceGroup
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 *
 */
export type SourceGroup = Readonly<{
  id: string | null;
  name: string | null;
}>;
