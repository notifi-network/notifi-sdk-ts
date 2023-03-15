import {
  ConnectedWallet,
  WalletWithSignParams,
} from '@notifi-network/notifi-core';
import { GqlError } from '@notifi-network/notifi-react-hooks';
import { addressEllipsis } from 'notifi-react-card/lib/utils/stringUtils';
import React, { useCallback, useMemo, useState } from 'react';

import { useNotifiSubscribe } from '../../hooks';

export type ConnectWalletRowProps = WalletWithSignParams &
  Readonly<{
    connectedWallets: ReadonlyArray<ConnectedWallet>;
  }>;

const hasKey = <K extends string>(
  obj: object,
  key: K,
): obj is object & { [k in K]: unknown } => {
  return typeof obj === 'object' && obj !== null && key in obj;
};

const findError = <C extends string>(
  errors: ReadonlyArray<unknown>,
  code: C,
): unknown | undefined => {
  return errors.find(
    (err) =>
      typeof err === 'object' &&
      err !== null &&
      hasKey(err, 'extensions') &&
      typeof err.extensions === 'object' &&
      err.extensions !== null &&
      hasKey(err.extensions, 'code') &&
      code === err.extensions.code,
  );
};

export const ConnectWalletRow: React.FC<ConnectWalletRowProps> = ({
  connectedWallets,
  displayName,
  ...walletParams
}: ConnectWalletRowProps) => {
  const { subscribeWallet } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const isConnected = useMemo(() => {
    const key = 'accountAddress';
    const address = hasKey(walletParams, key)
      ? walletParams[key]
      : walletParams.walletPublicKey;
    return connectedWallets.some(
      (it) =>
        it.address === address &&
        it.walletBlockchain === walletParams.walletBlockchain,
    );
  }, [connectedWallets, walletParams]);

  const shortenedAddress = useMemo(() => {
    if (walletParams === null || walletParams.walletPublicKey === null) {
      return null;
    }
    return addressEllipsis(walletParams.walletPublicKey);
  }, [walletParams]);

  const [isLoading, setIsLoading] = useState(false);
  const [isConnectedElsewhere, setIsConnectedElsewhere] = useState(false);

  const connectWallet = useCallback(
    async (technique: 'FAIL' | 'DISCONNECT_AND_CLOSE_OLD_ACCOUNT') => {
      setIsLoading(true);
      try {
        await subscribeWallet({
          walletParams,
          connectWalletConflictResolutionTechnique: technique,
        });
        setIsConnectedElsewhere(false);
      } catch (e: unknown) {
        if (e instanceof GqlError) {
          const alreadyConnectedError =
            findError(
              e.errors,
              'ERROR_WALLETCONNECT_ALREADY_CONNECTED_TO_ANOTHER_ACCOUNT_AND_LAST',
            ) ??
            findError(
              e.errors,
              'ERROR_WALLETCONNECT_ALREADY_CONNECTED_TO_ANOTHER_ACCOUNT',
            );
          if (alreadyConnectedError !== undefined) {
            setIsConnectedElsewhere(true);
          }
        }

        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [subscribeWallet, walletParams],
  );

  return (
    <div className="ConnectWalletRow__container">
      <div className="ConnectWalletRow__topRow">
        <p className="ConnectWalletRow__publicKey">
          {displayName ?? shortenedAddress}
        </p>
        {isConnected || isConnectedElsewhere ? null : (
          <button
            disabled={isLoading || isConnectedElsewhere}
            className="ConnectWalletRow__button"
            onClick={() => {
              connectWallet('FAIL').catch((e) => {
                console.log('Error connecting wallet', e);
              });
            }}
          >
            Verify
          </button>
        )}
        {isConnected ? (
          <p className="ConnectWalletRow__verified">Verified</p>
        ) : null}
      </div>
      {isConnectedElsewhere ? (
        <>
          <div className="ConnectWalletRow__messageRow">
            This wallet is already connected to another Notifi Hub account. If
            you continue, this wallet can only be used to access this account.
            You will lose access to the subscriptions in your other account.
          </div>
          <div className="ConnectWalletRow__bottomRow">
            <button
              disabled={isLoading}
              className="ConnectWalletRow__connectAnywayButton"
              onClick={() => {
                connectWallet('DISCONNECT_AND_CLOSE_OLD_ACCOUNT').catch((e) => {
                  console.log('Error connecting wallet', e);
                });
              }}
            >
              Verify anyway
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};
