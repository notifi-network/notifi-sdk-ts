import clsx from 'clsx';
import React, { useMemo } from 'react';

import { CheckIcon } from '../assets/CheckIcon';
import { FormField, useNotifiSubscriptionContext } from '../context';
import { DeepPartialReadonly } from '../utils';

export type VerifyBannerProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    bannerContainer?: string;
    bannerImage?: string;
    bannerImageContainer?: string;
    bannerLabel?: string;
    bannerContent?: string;
    bannerTitle?: string;
    bannerSubject?: string;
    bannerButton?: string;
  }>;
  unVerifiedDestinations: ReadonlyArray<FormField>;
}>;

export const VerifyBanner: React.FC<VerifyBannerProps> = ({
  classNames,
  unVerifiedDestinations,
}) => {
  const { setCardView } = useNotifiSubscriptionContext();

  const unVerifiedDestinationsString = useMemo(() => {
    const convertedUnVerifiedDestinations = unVerifiedDestinations.map(
      (target) => {
        switch (target) {
          case 'telegram':
            return 'Telegram ID';
          case 'discord':
            return 'Discord';
          case 'phoneNumber':
            return 'Phone Number';
          default:
            return target;
        }
      },
    );
    return convertedUnVerifiedDestinations.length > 1
      ? convertedUnVerifiedDestinations.join(' and ')
      : convertedUnVerifiedDestinations[0];
  }, [unVerifiedDestinations]);

  const onClick = () => {
    setCardView({
      state: 'preview',
    });
  };
  return (
    <div
      className={clsx('verifyBanner__container', classNames?.bannerContainer)}
    >
      <div className={clsx('verifyBanner__label', classNames?.bannerLabel)}>
        <div
          className={clsx(
            classNames?.bannerImage
              ? classNames?.bannerImageContainer
              : 'verifyBanner__imageContainer',
          )}
        >
          <CheckIcon className="verifyBanner__image" />
        </div>
        <div
          className={clsx('verifyBanner__subject', classNames?.bannerSubject)}
        >
          Verify your {unVerifiedDestinationsString}
        </div>
      </div>
      <button
        data-cy="verifyBannerButton"
        className={clsx(
          classNames?.bannerButton
            ? classNames.bannerButton
            : 'verifyBanner__button',
        )}
        onClick={onClick}
      >
        Verify
      </button>
    </div>
  );
};
