import { alertFragment, alertFragmentDependencies } from '../fragments';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
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
