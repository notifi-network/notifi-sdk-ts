import { Source } from "./Source";

/**
 * Object describing a SourceGroup
 *
 * @remarks
 * Object describing a SourceGroup
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {Source[]} sources - The Sources associated with the SourceGroup
 *
 */
export type SourceGroup = Readonly<{
  id: string | null;
  name: string | null;
  sources: ReadonlyArray<Source>;
}>;
