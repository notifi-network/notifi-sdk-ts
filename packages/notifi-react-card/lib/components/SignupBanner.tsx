import {
  CardConfigItemV1,
  ContactInfoConfig,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { CircleBellIcon } from '../assets/CircleBellIcon';
import { useNotifiSubscriptionContext } from '../context';
import { DeepPartialReadonly } from '../utils';

export type SignupBannerProps = Readonly<{
  data: CardConfigItemV1;
  classNames?: DeepPartialReadonly<{
    banner: string;
    bannerImage: string;
    bannerLabel: string;
    bannerContent: string;
    bannerTitle: string;
    bannerSubject: string;
    bannerButton: string;
  }>;
}>;

export const SignupBanner: React.FC<SignupBannerProps> = ({
  classNames,
  data,
}) => {
  const { cardView, setCardView } = useNotifiSubscriptionContext();

  const targets = useMemo(() => {
    const supportedTargets = Object.keys(data.contactInfo)
      .filter((target) => {
        return data.contactInfo[target as keyof ContactInfoConfig].active;
      })
      .map((target) => target.charAt(0).toLocaleUpperCase() + target.slice(1));
    return supportedTargets.length > 1
      ? supportedTargets.join(', ')
      : supportedTargets[0];
  }, []);
  const onClick = () => {
    setCardView({
      state: 'edit',
    });
  };
  return (
    <>
      <div
        className={clsx(
          classNames?.banner ? classNames.banner : 'SignupBanner',
          cardView.state === 'preview' && 'SignupBanner__Column',
        )}
      >
        <div className={clsx('SignupBanner__Label', classNames?.bannerLabel)}>
          <div
            className={clsx(
              classNames?.bannerImage
                ? classNames?.bannerImage
                : 'SignupBanner__Image',
            )}
          >
            <CircleBellIcon />
          </div>
          <div
            className={clsx(
              classNames?.bannerContent
                ? classNames.bannerContent
                : 'SignupBanner__Content',
            )}
          >
            <div
              className={clsx(
                classNames?.bannerTitle
                  ? classNames.bannerTitle
                  : 'SignupBanner__Title',
              )}
            >
              Get alerts via
            </div>
            <div
              className={clsx(
                classNames?.bannerSubject
                  ? classNames.bannerSubject
                  : 'SignupBanner__Subject',
              )}
            >
              {targets}
            </div>
          </div>
        </div>
        <button
          className={clsx(
            classNames?.bannerButton
              ? classNames.bannerButton
              : 'SignupBanner__Button',
          )}
          onClick={onClick}
        >
          Sign Up
        </button>
      </div>
    </>
  );
};
