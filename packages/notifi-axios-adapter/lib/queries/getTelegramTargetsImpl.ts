import {
  telegramTargetFragment,
  telegramTargetFragmentDependencies,
} from '../fragments';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
import { GetTelegramTargetsResult } from '@notifi-network/notifi-core';

const DEPENDENCIES = [
  ...telegramTargetFragmentDependencies,
  telegramTargetFragment,
];

const MUTATION = `
query getTelegramTargets {
  telegramTarget {
    ...telegramTargetFragment
  }
}
`.trim();

const getTelegramTargetsImpl =
  makeParameterLessRequest<GetTelegramTargetsResult>(
    collectDependencies(...DEPENDENCIES, MUTATION),
    'telegramTarget',
  );

export default getTelegramTargetsImpl;
