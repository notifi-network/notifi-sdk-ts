import { GetTelegramTargetsResult } from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import {
  telegramTargetFragment,
  telegramTargetFragmentDependencies
} from '../fragments';

const DEPENDENCIES = [
  ...telegramTargetFragmentDependencies,
  telegramTargetFragment
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
    'telegramTarget'
  );

export default getTelegramTargetsImpl;
