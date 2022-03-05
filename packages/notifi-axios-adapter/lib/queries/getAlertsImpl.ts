import { GetAlertsResult } from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import { alertFragment, alertFragmentDependencies } from '../fragments';

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
  'alert'
);

export default getAlertsImpl;
