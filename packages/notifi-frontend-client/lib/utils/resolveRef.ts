import { CheckRatio, ValueOrRef } from '../models';

type Validator<T> = (item: unknown) => item is T;
type ResolveFunc<T> = (
  name: string,
  valueOrRef: ValueOrRef<T>,
  inputs: Record<string, unknown>,
) => T;

const createRefResolver = <T>(validator: Validator<T>): ResolveFunc<T> => {
  return (
    name: string,
    valueOrRef: ValueOrRef<T>,
    inputs: Record<string, unknown>,
  ) => {
    if (valueOrRef.type === 'value') {
      return valueOrRef.value;
    } else {
      if (valueOrRef.ref === null) {
        throw new Error(`Invalid configuration: Ref ${name} is null`);
      }

      const runtimeInput = inputs[valueOrRef.ref];
      if (validator(runtimeInput)) {
        return runtimeInput;
      } else {
        throw new Error(`Invalid value provided for ${name}: ${runtimeInput}`);
      }
    }
  };
};

export const resolveStringRef = createRefResolver(
  (item: unknown): item is string => {
    return typeof item === 'string';
  },
);

export const resolveNumberRef = createRefResolver(
  (item: unknown): item is number => {
    return typeof item === 'number' && !Number.isNaN(item);
  },
);

export const resolveStringArrayRef = createRefResolver(
  (item: unknown): item is ReadonlyArray<string> => {
    return (
      Array.isArray(item) &&
      item.every((element) => typeof element === 'string')
    );
  },
);

export const resolveCheckRatioArrayRef = createRefResolver(
  (item: unknown): item is ReadonlyArray<CheckRatio> => {
    return (
      Array.isArray(item) &&
      item.every(
        (element) =>
          typeof element === 'object' &&
          typeof element.type === 'string' &&
          typeof element.ratio === 'number' &&
          !Number.isNaN(element.ratio),
      )
    );
  },
);
