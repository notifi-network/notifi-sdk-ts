import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../../hooks';
import { createConfigurations } from '../../../utils';
import { WalletList } from '../../WalletList';
import NotifiCardButton, {
  NotifiCardButtonProps,
} from '../../common/NotifiCardButton';

export type VerifyWalletViewProps = Readonly<{
  classNames?: Readonly<{
    NotifiVerifyContainer?: string;
    NotifiInputHeading?: string;
    NotifiCardButtonProps?: NotifiCardButtonProps['classNames'];
  }>;
  buttonText: string;
  data: CardConfigItemV1;
  inputs: Record<string, unknown>;
}>;

const VerifyWalletView: React.FC<VerifyWalletViewProps> = ({
  classNames,
  buttonText,
  data,
  inputs,
}) => {
  const {
    cardView,
    setCardView,
    loading,
    setLoading,
    connectedWallets,
    demoPreview,
  } = useNotifiSubscriptionContext();

  const subscribe = demoPreview
    ? null
    : useNotifiSubscribe({
        targetGroupName: 'Default',
      });

  const onClick = useCallback(async () => {
    if (!subscribe) return;
    if (cardView.state === 'verifyonboarding') {
      setLoading(true);

      try {
        const alertConfigs = createConfigurations(
          data.eventTypes,
          inputs,
          connectedWallets,
        );

        await subscribe.subscribe(alertConfigs);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);

      try {
        await subscribe.updateWallets();
      } finally {
        setLoading(false);
      }
    }
    setCardView({ state: 'preview' });
  }, [setLoading, data, inputs, connectedWallets, subscribe?.subscribe]);

  return (
    <div
      className={clsx(
        'NotifiVerifyContainer',
        classNames?.NotifiVerifyContainer,
      )}
    >
      <WalletList />
      <NotifiCardButton
        buttonText={buttonText}
        disabled={loading}
        onClick={onClick}
      />
    </div>
  );
};

export default VerifyWalletView;
