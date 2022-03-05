import {
  ClientData,
  MessageSigner,
  TargetGroup,
  UpdateAlertInput,
  User
} from '@notifi-network/notifi-core';
import { GqlError } from '@notifi-network/notifi-axios-adapter';
import useNotifiClient from './useNotifiClient';
import { BlockchainEnvironment } from './useNotifiConfig';

export {
  BlockchainEnvironment,
  ClientData,
  GqlError,
  MessageSigner,
  TargetGroup,
  UpdateAlertInput,
  User,
  useNotifiClient
};
