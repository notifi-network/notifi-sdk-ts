/**
 * @description Returns an array of the object's keys with the correct type.
 * @example
 * const destinations: Record<FormField, string> = { email: 'email', phoneNumber: 'phoneNumber' };
 * const keys = objectKeys(destinations); // type of Keys is FormField[] instead of string[] (which is the default type of Object.keys)
 */
export const objectKeys = <T extends Record<keyof T, unknown>>(
  object: T,
): (keyof T)[] => {
  return Object?.keys(object) as (keyof T)[];
};

export type DeepPartialReadonly<T> = T extends object
  ? Readonly<{
      [Key in keyof T]?: DeepPartialReadonly<T[Key]>;
    }>
  : T;
