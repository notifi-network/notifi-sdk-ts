import { alertFragment, alertFragmentDependencies } from '../fragments';
import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetAlertsResult } from '@notifi-network/notifi-core';

const DEPENDENCIES = [...alertFragmentDependencies, alertFragment];

const MUTATION = `
query getAlerts {
  alert {
    ...alertFragment
  }
}
`.trim();

const getAlertsImpl = makeParameterLessRequest<GetAlertsResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'alert',
);

export default getAlertsImpl;
