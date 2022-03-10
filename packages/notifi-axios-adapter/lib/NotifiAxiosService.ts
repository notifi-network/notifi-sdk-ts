import createAlertImpl from './mutations/createAlertImpl';
import createEmailTargetImpl from './mutations/createEmailTargetImpl';
import createSmsTargetImpl from './mutations/createSmsTargetImpl';
import createSourceGroupImpl from './mutations/createSourceGroupImpl';
import createTargetGroupImpl from './mutations/createTargetGroupImpl';
import createTelegramTargetImpl from './mutations/createTelegramTargetImpl';
import deleteAlertImpl from './mutations/deleteAlertImpl';
import deleteSourceGroupImpl from './mutations/deleteSourceGroupImpl';
import deleteTargetGroupImpl from './mutations/deleteTargetGroupImpl';
import logInFromDappImpl from './mutations/logInFromDappImpl';
import updateTargetGroupImpl from './mutations/updateTargetGroupImpl';
import getAlertsImpl from './queries/getAlertsImpl';
import getEmailTargetsImpl from './queries/getEmailTargetsImpl';
import getFiltersImpl from './queries/getFiltersImpl';
import getSmsTargetsImpl from './queries/getSmsTargetsImpl';
import getSourceGroupsImpl from './queries/getSourceGroupsImpl';
import getSourcesImpl from './queries/getSourcesImpl';
import getTargetGroupsImpl from './queries/getTargetGroupsImpl';
import getTelegramTargetsImpl from './queries/getTelegramTargetsImpl';
import { NotifiService } from '@notifi-network/notifi-core';
import axios from 'axios';

export type NotifiAxiosServiceConfig = Readonly<{
  gqlUrl: string;
  jwtContainer: { current: string | null };
}>;

export class NotifiAxiosService implements NotifiService {
  createAlert: NotifiService['createAlert'];
  createEmailTarget: NotifiService['createEmailTarget'];
  createSmsTarget: NotifiService['createSmsTarget'];
  createSourceGroup: NotifiService['createSourceGroup'];
  createTargetGroup: NotifiService['createTargetGroup'];
  createTelegramTarget: NotifiService['createTelegramTarget'];
  deleteAlert: NotifiService['deleteAlert'];
  deleteSourceGroup: NotifiService['deleteSourceGroup'];
  deleteTargetGroup: NotifiService['deleteTargetGroup'];
  getAlerts: NotifiService['getAlerts'];
  getEmailTargets: NotifiService['getEmailTargets'];
  getFilters: NotifiService['getFilters'];
  getSmsTargets: NotifiService['getSmsTargets'];
  getSourceGroups: NotifiService['getSourceGroups'];
  getSources: NotifiService['getSources'];
  getTargetGroups: NotifiService['getTargetGroups'];
  getTelegramTargets: NotifiService['getTelegramTargets'];
  logInFromDapp: NotifiService['logInFromDapp'];
  updateTargetGroup: NotifiService['updateTargetGroup'];

  private jwtContainer;

  constructor(c: NotifiAxiosServiceConfig) {
    this.jwtContainer = c.jwtContainer;
    const a = axios.create({
      baseURL: c.gqlUrl,
    });
    a.interceptors.request.use((config) => {
      const jwt = this.jwtContainer.current;
      if (jwt !== undefined) {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${jwt}`,
          },
        };
      }

      return config;
    });

    this.createAlert = createAlertImpl.bind(null, a);
    this.createEmailTarget = createEmailTargetImpl.bind(null, a);
    this.createSmsTarget = createSmsTargetImpl.bind(null, a);
    this.createTargetGroup = createTargetGroupImpl.bind(null, a);
    this.createTelegramTarget = createTelegramTargetImpl.bind(null, a);
    this.createSourceGroup = createSourceGroupImpl.bind(null, a);
    this.deleteAlert = deleteAlertImpl.bind(null, a);
    this.deleteSourceGroup = deleteSourceGroupImpl.bind(null, a);
    this.deleteTargetGroup = deleteTargetGroupImpl.bind(null, a);
    this.getAlerts = getAlertsImpl.bind(null, a);
    this.getEmailTargets = getEmailTargetsImpl.bind(null, a);
    this.getFilters = getFiltersImpl.bind(null, a);
    this.getSmsTargets = getSmsTargetsImpl.bind(null, a);
    this.getSourceGroups = getSourceGroupsImpl.bind(null, a);
    this.getSources = getSourcesImpl.bind(null, a);
    this.getTargetGroups = getTargetGroupsImpl.bind(null, a);
    this.getTelegramTargets = getTelegramTargetsImpl.bind(null, a);
    this.logInFromDapp = logInFromDappImpl.bind(null, a);
    this.updateTargetGroup = updateTargetGroupImpl.bind(null, a);
  }

  setJwt = (jwt: string | null) => {
    this.jwtContainer.current = jwt;
  };
}
