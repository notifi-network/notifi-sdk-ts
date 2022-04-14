export type DeepPartialReadonly<T> = T extends object
  ? Readonly<{
      [Key in keyof T]?: DeepPartialReadonly<T[Key]>;
    }>
  : T;
