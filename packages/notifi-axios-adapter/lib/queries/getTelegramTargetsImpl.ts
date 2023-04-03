import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetTelegramTargetsResult } from '@notifi-network/notifi-core';

import {
  telegramTargetFragment,
  telegramTargetFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [
  ...telegramTargetFragmentDependencies,
  telegramTargetFragment,
];

const QUERY = `
query getTelegramTargets {
  telegramTarget {
    ...telegramTargetFragment
  }
}
`.trim();

const getTelegramTargetsImpl =
  makeParameterLessRequest<GetTelegramTargetsResult>(
    collectDependencies(...DEPENDENCIES, QUERY),
    'telegramTarget',
  );

export default getTelegramTargetsImpl;
