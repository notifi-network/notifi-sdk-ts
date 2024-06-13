import { objectKeys } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import {
  Target,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import { defaultCopy, hasTarget } from '../utils';

export type TargetStateBannerProps = {
  classNames?: {
    container?: string;
    verifyBanner?: string;
    verifyBannerIcon?: string;
    verifyBannerContent?: string;
    verifyBannerTitle?: string;
    verifyBannerDescription?: string;
    verifyBannerCta?: string;
    signupBanner?: string;
    signupBannerContent?: string;
    signupBannerIcon?: string;
    signupBannerText?: string;
    signupBannerCta?: string;
  };
  copy?: {
    verify?: {
      title?: string;
      description?: string;
    };
    signup?: {
      text?: string;
      cta?: string;
    };
  };
  onClickCta?: () => void;
  parentComponent?: 'history' | 'config';
};

export const TargetStateBanner: React.FC<TargetStateBannerProps> = (props) => {
  const parentComponent = props.parentComponent ?? 'config';
  const {
    unVerifiedTargets,
    targetDocument: { targetData },
    isLoading: isLoadingTarget,
  } = useNotifiTargetContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  if (!cardConfig || isLoadingTarget) return null;

  const activeTargets = objectKeys(cardConfig.contactInfo)
    .map((target) =>
      cardConfig.contactInfo[target]?.active
        ? target.charAt(0).toUpperCase() + target.slice(1)
        : null,
    )
    .filter((target): target is string => target !== null);

  return (
    <div
      className={clsx(
        'notifi-target-state-banner',
        props.classNames?.container,
      )}
    >
      {!hasTarget(targetData) && parentComponent === 'config' ? (
        <div
          className={clsx(
            'notifi-target-state-banner-signup',
            props.classNames?.signupBanner,
          )}
        >
          <div
            className={clsx(
              'notifi-target-state-banner-signup-content',
              props.classNames?.signupBannerContent,
            )}
          >
            <div
              className={clsx(
                'notifi-target-state-banner-signup-icon',
                props.classNames?.signupBannerIcon,
              )}
            >
              <Icon type="bell-circle" />
            </div>
            <div
              className={clsx(
                'notifi-target-state-banner-signup-text',
                props.classNames?.signupBannerText,
              )}
            >
              {props.copy?.signup?.text ??
                defaultCopy.targetStateBanner.Signup.text}
              {''}
              {/* Only the last element should be joined with ', or', others should be joined with ', ' */}
              {activeTargets.length > 1
                ? `${activeTargets
                    .slice(0, -1)
                    .join(', ')}, or ${activeTargets.slice(-1)}`
                : activeTargets.slice(-1)}
            </div>
          </div>
          <button
            className={clsx(
              'notifi-target-state-banner-signup-cta',
              props.classNames?.signupBannerCta,
            )}
            onClick={props.onClickCta}
          >
            {props.copy?.signup?.cta ??
              defaultCopy.targetStateBanner.Signup.cta}
          </button>
        </div>
      ) : null}

      {!hasTarget(targetData) && parentComponent === 'history' ? (
        <div
          className={clsx(
            'notifi-target-state-banner-signup',
            parentComponent === 'history' && 'history',
            props.classNames?.signupBanner,
          )}
        >
          <div
            className={clsx(
              'notifi-target-state-banner-signup-content',
              parentComponent === 'history' && 'history',
              props.classNames?.signupBannerContent,
            )}
          >
            <div
              className={clsx(
                'notifi-target-state-banner-signup-icon',
                parentComponent === 'history' && 'history',
                props.classNames?.signupBannerIcon,
              )}
            >
              <Icon type="bell-thin" />
            </div>
            <div
              className={clsx(
                'notifi-target-state-banner-signup-text',
                props.classNames?.signupBannerText,
              )}
            >
              {props.copy?.signup?.text ??
                defaultCopy.targetStateBanner.Signup.text}
              {''}
              {activeTargets.length > 1
                ? `${activeTargets
                    .slice(0, -1)
                    .join(', ')}, or ${activeTargets.slice(-1)}`
                : activeTargets.slice(-1)}
            </div>
          </div>
          <button
            className={clsx(
              'notifi-target-state-banner-signup-cta',
              parentComponent === 'history' && 'history',
              props.classNames?.signupBannerCta,
            )}
            onClick={props.onClickCta}
          >
            {props.copy?.signup?.cta ??
              defaultCopy.targetStateBanner.Signup.cta}
          </button>
        </div>
      ) : null}

      {hasTarget(targetData) && parentComponent === 'config' ? (
        <div
          className={clsx(
            'notifi-target-state-banner-verify',
            props.classNames?.verifyBanner,
          )}
          onClick={props.onClickCta}
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
          >
            <Icon type="chevron-right" />
          </div>
        </div>
      ) : null}

      {hasTarget(targetData) && parentComponent === 'history' ? (
        <div
          className={clsx(
            'notifi-target-state-banner-verify',
            parentComponent === 'history' && 'history',
            props.classNames?.verifyBanner,
          )}
          onClick={props.onClickCta}
        >
          <div
            className={clsx(
              'notifi-target-state-banner-verify-icon',
              parentComponent === 'history' && 'history',
              props.classNames?.verifyBannerIcon,
            )}
          >
            <Icon type="check-circle" />
            {/* TODO: Allow to pass in a custom icon */}
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
                parentComponent === 'history' && 'history',
                props.classNames?.verifyBannerTitle,
              )}
            >
              {`${
                defaultCopy.targetStateBanner.verifyInHistory.title
              } ${formatUnverifiedTargets(unVerifiedTargets)}`}
            </div>
          </div>
          <div
            className={clsx(
              'notifi-target-state-banner-verify-cta',
              parentComponent === 'history' && 'history',
              props.classNames?.verifyBannerCta,
            )}
          >
            {defaultCopy.targetStateBanner.verifyInHistory.ctaText}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Utils

const formatUnverifiedTargets = (unVerifiedTargets: Target[]) => {
  const captializedTargets = unVerifiedTargets.map(
    (target) => target.charAt(0).toUpperCase() + target.slice(1),
  );
  return captializedTargets.length > 1
    ? `${captializedTargets
        .slice(0, -1)
        .join(', ')}, and ${captializedTargets.slice(-1)}`
    : captializedTargets.slice(-1);
};
