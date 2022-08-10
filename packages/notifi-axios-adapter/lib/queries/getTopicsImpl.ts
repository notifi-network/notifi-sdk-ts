import {
  AxiosPost,
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetTopicsResult, UserTopic } from '@notifi-network/notifi-core';

import { userTopicFragment, userTopicFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...userTopicFragmentDependencies, userTopicFragment];

const MUTATION = `
query getTopics {
  topics {
    nodes {
      ...userTopicFragment
    }
  }
}
`.trim();

// TODO: create Connection type in Core
type Connection<T> = Readonly<{
  nodes: ReadonlyArray<T>;
}>;

const getTopicsConnection = makeParameterLessRequest<Connection<UserTopic>>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'topics',
);

const getTopicsImpl: (axiosInstance: AxiosPost) => Promise<GetTopicsResult> = (
  axiosInstance,
) => getTopicsConnection(axiosInstance).then((result) => result.nodes);

export default getTopicsImpl;
