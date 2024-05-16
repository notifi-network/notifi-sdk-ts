import { objectKeys } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import {
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import { defaultCopy } from '../utils';

export type TargetStateBannerProps = {
  classNames?: {
    container?: string;
    verifyBanner?: string;
    verifyBannerIcon?: string;
    verifyBannerContent?: string;
    verifyBannerTitle?: string;
    verifyBannerDescription?: string;
    verifyBannerCta?: string;
  };
  copy?: {
    verify?: {
      title?: string;
      description?: string;
    };
  };
  onClickCta?: () => void;
};

export const TargetStateBanner: React.FC<TargetStateBannerProps> = (props) => {
  const {
    unVerifiedTargets,
    targetDocument: { targetData },
  } = useNotifiTargetContext();
  const { cardConfig } = useNotifiTenantConfigContext();

  const hasTarget = !objectKeys(targetData).every((key) => {
    const target = targetData[key];
    if (typeof target === 'string') {
      return !target;
    }
    if (typeof target === 'object') {
      return !target.data;
    }
  });

  return (
    <div
      className={clsx(
        'notifi-target-state-banner',
        props.classNames?.container,
      )}
    >
      {!hasTarget && !cardConfig?.isContactInfoRequired ? (
        <div>TODO: Register new target</div>
      ) : (
        <div
          className={clsx(
            'notifi-target-state-banner-verify',
            props.classNames?.verifyBanner,
          )}
        >
          <div
            className={clsx(
              'notifi-target-state-banner-verify-icon',
              props.classNames?.verifyBannerIcon,
            )}
          >
            <Icon type="round-bell" />
          </div>
          <div
            className={clsx(
              'notifi-target-state-banner-verify-content',
              props.classNames?.verifyBannerContent,
            )}
          >
            <div
              className={clsx(
                'notifi-target-state-banner-verify-title',
                props.classNames?.verifyBannerTitle,
              )}
            >
              {props.copy?.verify?.title ??
                defaultCopy.targetStateBanner.verify.title}
            </div>
            {unVerifiedTargets.length > 0 && (
              <div
                className={clsx(
                  'notifi-target-state-banner-verify-description',
                  props.classNames?.verifyBannerDescription,
                )}
              >
                {props.copy?.verify?.description ??
                  defaultCopy.targetStateBanner.verify.description}
              </div>
            )}
          </div>
          <div
            className={clsx(
              'notifi-target-state-banner-verify-cta',
              props.classNames?.verifyBannerCta,
            )}
            onClick={props.onClickCta}
          >
            <Icon type="chevron-right" />
          </div>
        </div>
      )}
    </div>
  );
};
