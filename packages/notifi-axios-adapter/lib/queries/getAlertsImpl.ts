import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetAlertsResult } from '@notifi-network/notifi-core';

import { alertFragment, alertFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...alertFragmentDependencies, alertFragment];

const QUERY = `
query getAlerts {
  alert {
    ...alertFragment
  }
}
`.trim();

const getAlertsImpl = makeParameterLessRequest<GetAlertsResult>(
  collectDependencies(...DEPENDENCIES, QUERY),
  'alert',
);

export default getAlertsImpl;
