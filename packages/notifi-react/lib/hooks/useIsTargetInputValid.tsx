import { objectKeys } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import {
  TargetInputFromValue,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import { getAvailableTargetInputCount } from '../utils';

export const useIsTargetInputValid = () => {
  const { cardConfig } = useNotifiTenantConfigContext();
  const {
    targetDocument: { targetInputs },
  } = useNotifiTargetContext();
  const isInputValid = React.useMemo(() => {
    const isInputValid = !objectKeys(targetInputs)
      .map((key) => {
        if (typeof targetInputs[key] !== 'boolean') {
          const targetInput = targetInputs[key] as TargetInputFromValue;
          if (targetInput.error) {
            return false;
          }
        }
        return true;
      })
      .includes(false);

    if (cardConfig?.isContactInfoRequired) {
      return isInputValid && getAvailableTargetInputCount(targetInputs) > 0;
    }
    return isInputValid;
  }, [targetInputs]);
  return isInputValid;
};
