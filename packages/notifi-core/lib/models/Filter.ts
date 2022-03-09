/**
 * Object describing a Filter
 *
 * @remarks
 * Object describing a Filter
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 *
 */
export type Filter = Readonly<{
  id: string | null;
  name: string | null;
}>;
