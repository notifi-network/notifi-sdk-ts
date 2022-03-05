export type Operation<Input, Result> = (input: Input) => Promise<Result>;

export type ParameterLessOperation<Result> = () => Promise<Result>;
