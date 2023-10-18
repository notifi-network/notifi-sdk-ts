import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import AlertActionIcon from './AlertBox/AlertActionIcon';
import { AlertsPanel, AlertsPanelProps, FtuConfigStep } from './subscription';

export type ConfigAlertModalProps = Readonly<{
  classNames?: {
    container?: string;
    overlay?: string;
    alertsPanel?: AlertsPanelProps['classNames'];
    headerContainer?: string;
    backIcon?: string;
    headerTitle?: string;
    closeIcon?: string;
    footerContainer?: string;
    ctaIcon?: string;
  };
  setFtuConfigStep: (step: FtuConfigStep) => void;
  data: CardConfigItemV1;
  inputDisabled: boolean;
  inputs: Record<string, unknown>;
}>;

export const ConfigAlertModal: React.FC<ConfigAlertModalProps> = ({
  classNames,
  setFtuConfigStep,
  data,
  inputDisabled,
  inputs,
}) => {
  return (
    <>
      <div
        className={clsx('configAlertModal__overlay', classNames?.overlay)}
      ></div>
      <div
        className={clsx('configAlertModal__container', classNames?.container)}
      >
        <div
          className={clsx(
            'configAlertModal__headerContainer',
            classNames?.headerContainer,
          )}
        >
          {data.isContactInfoRequired ? (
            <div
              className={clsx(
                'configAlertModal__backIcon',
                classNames?.backIcon,
              )}
            >
              <AlertActionIcon
                name="back"
                className={clsx(
                  'configAlertModal__ctaIcon',
                  classNames?.ctaIcon,
                )}
              />
            </div>
          ) : null}
          <div
            className={clsx(
              'configAlertModal__headerTitle',
              classNames?.headerTitle,
            )}
          >
            <div>Select alerts</div>
          </div>
          <div
            className={clsx(
              'configAlertModal__closeIcon',
              classNames?.closeIcon,
            )}
            onClick={() => setFtuConfigStep(FtuConfigStep.Done)}
          >
            <AlertActionIcon
              name="close"
              className={clsx('configAlertModal__ctaIcon', classNames?.ctaIcon)}
            />
          </div>
        </div>
        <AlertsPanel
          classNames={
            classNames?.alertsPanel ?? {
              EventTypeContainer: 'configAlertModal__EventTypeContainer',
              EventTypeBroadcastRow: {
                container: 'configAlertModal__EventTypeBroadcastRow',
              },
              EventTypeCustomHealthCheckRow: {
                container: 'configAlertModal__EventTypeCustomHealthCheckRow',
                content:
                  'configAlertModal__EventTypeCustomHealthCheckRow__Subtitle',
                buttonContainer:
                  'configAlertModal__EventTypeCustomHealthCheckRow__ButtonContainer',
              },
              EventTypeDirectPushRow: {
                container: 'configAlertModal__EventTypeDirectPushRow',
              },
              EventTypeHealthCheckRow: {
                container: 'configAlertModal__EventTypeHealthCheckRow',
                content: 'configAlertModal__EventTypeHealthCheckRow__Subtitle',
                buttonContainer:
                  'configAlertModal__EventTypeHealthCheckRow__ButtonContainer',
              },
              EventTypePriceChangeRow: {
                container: 'configAlertModal__EventTypePriceChangeRow',
              },
              EventTypeTradingPairsRow: {
                container: 'configAlertModal__EventTypeTradingPairsRow',
              },
              EventTypeFusionMultiThresholdRow: {
                container: 'configAlertModal__EventTypeFusionMultiThresholdRow',
              },
              EventTypeWalletBalanceRow: {
                container: 'configAlertModal__EventTypeWalletBalanceRow',
              },
              EventTypeXMTPRow: {
                container: 'configAlertModal__EventTypeXMTPRow',
              },
              EventTypeFusionToggleRow: {
                container: 'configAlertModal__EventTypeFusionToggleRow',
              },
              EventTypeFusionHealthCheckRow: {
                container: 'configAlertModal__EventTypeFusionHealthCheckRow',
                content:
                  'configAlertModal__EventTypeFusionHealthCheckRow__Subtitle',
                buttonContainer:
                  'configAlertModal__EventTypeFusionHealthCheckRow__ButtonContainer',
              },
            }
          }
          data={data}
          inputDisabled={inputDisabled}
          inputs={inputs}
        />
        <div
          className={clsx(
            'configAlertModal__footerContainer',
            classNames?.footerContainer,
          )}
        >
          <button onClick={() => setFtuConfigStep(FtuConfigStep.Done)}>
            Done
          </button>
        </div>
      </div>
    </>
  );
};
