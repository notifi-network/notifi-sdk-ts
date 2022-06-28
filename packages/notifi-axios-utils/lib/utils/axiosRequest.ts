import type { AxiosPost } from '../types';
import { GqlError } from '../types';
import { AxiosRequestConfig } from 'axios';

type PostResponse<Result> = Readonly<{
  data?: Record<string, Result | null | undefined> | null;
  errors?: ReadonlyArray<unknown>;
}>;

const makeRequestInternal = async <Input, Result>(
  query: string,
  resultKey: string,
  axiosInstance: AxiosPost,
  variables: Input,
  config?: AxiosRequestConfig<Input>,
): Promise<Result> => {
  console.log("### makeRequestInternal", {resultKey});
  const { data } = await axiosInstance.post<PostResponse<Result>>(
    `/${resultKey}`,
    {
      query,
      variables,
    },
    config,
  );

  const result = data?.data?.[resultKey];
  const errors = data?.errors;
  if (result != null) {
    return result;
  }

  if (errors != null) {
    throw new GqlError(resultKey, errors);
  }

  throw new Error('Unknown error in makeRequest');
};

const makeAuthenticatedRequest = <Input, Result>(
  query: string,
  resultKey: string,
): ((
  axiosInstance: AxiosPost,
  jwt: string,
  variables: Input,
) => Promise<Result>) => {
  return (axiosInstance, jwt, variables) =>
    makeRequestInternal(query, resultKey, axiosInstance, variables, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
};

const makeRequest = <Input, Result>(
  query: string,
  resultKey: string,
): ((axiosInstance: AxiosPost, variables: Input) => Promise<Result>) => {
  return (axiosInstance, variables) =>
    makeRequestInternal(query, resultKey, axiosInstance, variables);
};

const makeParameterLessRequest = <Result>(
  query: string,
  resultKey: string,
): ((axiosInstance: AxiosPost) => Promise<Result>) => {
  return (axiosInstance) =>
    makeRequestInternal(query, resultKey, axiosInstance, undefined);
};

export { makeAuthenticatedRequest, makeParameterLessRequest, makeRequest };
