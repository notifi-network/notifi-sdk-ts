const hasKey = <T, Key extends PropertyKey>(
  obj: T,
  prop: Key
): obj is T & Record<Key, unknown> => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.prototype.hasOwnProperty.call(obj, prop)
  );
};

const packageErrors = (
  errors: ReadonlyArray<unknown>
): ReadonlyArray<string> => {
  const messages: string[] = [];
  errors.forEach((error) => {
    if (hasKey(error, 'message') && typeof error.message === 'string') {
      messages.push(error.message);
    }
  });
  return messages;
};

export default class GqlError extends Error {
  constructor(
    public operationName: string,
    public errors: ReadonlyArray<unknown>
  ) {
    super(`GQL Errors occurred during ${operationName}`);
  }

  public getErrorMessages(): ReadonlyArray<string> {
    return packageErrors(this.errors);
  }
}
