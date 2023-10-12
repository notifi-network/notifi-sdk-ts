import {
  EventTypeItem,
  FusionEventTypeItem,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { DeleteIcon } from '../../assets/DeleteIcon';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import {
  FusionMultiThresholdEventTypeItem,
  SubscriptionData,
  useNotifiSubscribe,
} from '../../hooks';
import {
  DeepPartialReadonly,
  fusionHealthCheckConfiguration,
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from '../../utils';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

export type EventTypeFusionMultiThresholdRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    content: string;
    label: string;
    addThreshold: string;
    tooltip: NotifiTooltipProps['classNames'];
    fusionMultiThresholdAlertRow: FusionMultiThresholdAlertRowProps['classNames'];
    fusionMultiThresholdSettingsRow: FusionMultiThresholdSettingsRowProps['classNames'];
  }>;
  config: FusionMultiThresholdEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeFusionMultiThresholdRow: React.FC<
  EventTypeFusionMultiThresholdRowProps
> = ({ classNames, config, inputs }: EventTypeFusionMultiThresholdRowProps) => {
  const { name, tooltipContent } = config;
  const { alerts } = useNotifiSubscriptionContext();

  const fusionMultiThresholdAlertNames = useMemo(() => {
    if (alerts === undefined) {
      return [];
    }

    return Object.keys(alerts)
      .filter((alertName) => alertName.indexOf(config.name) >= 0)
      .sort((a, b) => {
        const getTime = (alertName: string) => {
          const [, time] = alertName.split(':;:');
          const date = new Date(time);
          return date.getTime();
        };

        return getTime(a) - getTime(b);
      });
  }, [alerts, config.name]);

  const [showInput, setShowInput] = useState(false);
  const hasSetInput = useRef(false);
  useEffect(() => {
    if (!hasSetInput.current && alerts !== undefined) {
      hasSetInput.current = true;
      setShowInput(fusionMultiThresholdAlertNames.length === 0);
    }
  }, [alerts, fusionMultiThresholdAlertNames]);

  return (
    <div
      className={clsx(
        'EventTypeFusionMultiThresholdRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'EventTypeFusionMultiThresholdRow__label',
          classNames?.label,
        )}
      >
        {name}
        {tooltipContent !== undefined && tooltipContent.length > 0 ? (
          <NotifiTooltip
            classNames={classNames?.tooltip}
            content={tooltipContent}
          />
        ) : null}
      </div>
      <div
        className={clsx(
          'EventTypeFusionMultiThresholdRow__content',
          classNames?.content,
        )}
      >
        {config.subtitle
          ? config.subtitle
          : `Alert me when my margin ratio is:`}
      </div>
      {fusionMultiThresholdAlertNames.map((alertName) => {
        return (
          <FusionMultiThresholdAlertRow
            key={alertName}
            classNames={classNames?.fusionMultiThresholdAlertRow}
            alertName={alertName}
            inputs={inputs}
          />
        );
      })}
      {showInput ? (
        <FusionMultiThresholdSettingsRow
          classNames={classNames?.fusionMultiThresholdSettingsRow}
          config={config}
          inputs={inputs}
          onSave={() => {
            setShowInput(false);
          }}
        />
      ) : null}
      <button
        className={clsx(
          'EventTypeFusionMultiThresholdRow__addThreshold',
          classNames?.addThreshold,
        )}
        disabled={showInput}
        onClick={() => {
          setShowInput(true);
        }}
      >
        {config.addThresholdTitle ? config.addThresholdTitle : 'Add alert'}
      </button>
    </div>
  );
};

export type FusionMultiThresholdAlertRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    textContainer: string;
    name: string;
    description: string;
    deleteIcon: string;
  }>;
  alertName: string;
  inputs: Record<string, unknown>;
}>;

export const FusionMultiThresholdAlertRow: React.FC<
  FusionMultiThresholdAlertRowProps
> = ({ classNames, alertName, inputs }: FusionMultiThresholdAlertRowProps) => {
  const { render } = useNotifiSubscriptionContext();

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const { isUsingFrontendClient, frontendClient } = useNotifiClientContext();

  const name = useMemo(() => {
    const [, , above, threshold] = alertName.split(':;:');
    return above + ' ' + threshold;
  }, [alertName]);

  const unSubscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs: Record<string, unknown>;
      }>,
    ) => {
      if (isUsingFrontendClient) {
        return unsubscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertName: alertDetail.eventType.name,
          alertConfiguration: null,
        });
      }
    },
    [isUsingFrontendClient, frontendClient],
  );

  return (
    <div
      className={clsx(
        'FusionMultiThresholdAlertRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'FusionMultiThresholdAlertRow__textContainer',
          classNames?.textContainer,
        )}
      >
        <span
          className={clsx(
            'FusionMultiThresholdAlertRow__name',
            classNames?.name,
          )}
        >
          {name}
        </span>
      </div>
      <div
        className={clsx(
          'FusionMultiThresholdAlertRow__deleteIcon',
          classNames?.deleteIcon,
        )}
        onClick={() => {
          unSubscribeAlert({
            eventType: {
              name: alertName,
            } as EventTypeItem, // We only need alertName to unsubscribe
            inputs,
          }).then(() => {
            isUsingFrontendClient && frontendClient.fetchData().then(render);
          });
        }}
      >
        <DeleteIcon />
      </div>
    </div>
  );
};
export type FusionMultiThresholdSettingsRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    buttonContainer: string;
    radioButton: string;
    container: string;
    label: string;
    option: string;
    thresholdInput: string;
    thresholdInputContainer: string;
    saveButton: string;
  }>;
  config: FusionMultiThresholdEventTypeItem;
  inputs: Record<string, unknown>;
  onSave: () => void;
}>;

export const FusionMultiThresholdSettingsRow: React.FC<
  FusionMultiThresholdSettingsRowProps
> = ({
  classNames,
  config,
  inputs,
  onSave,
}: FusionMultiThresholdSettingsRowProps) => {
  const [above, setAbove] = useState<boolean>(true);
  const [threshold, setThreshold] = useState<number>(0.0);
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const { render } = useNotifiSubscriptionContext();

  const { isUsingFrontendClient, frontendClient } = useNotifiClientContext();

  const fusionEventId = useMemo(
    () => resolveStringRef(config.name, config.fusionEventId, inputs),
    [config, inputs],
  );

  const fusionSourceAddress = useMemo(
    () => resolveStringRef(config.name, config.sourceAddress, inputs),
    [config, inputs],
  );

  const alertConfiguration = useMemo(() => {
    return fusionHealthCheckConfiguration({
      maintainSourceGroup: config?.maintainSourceGroup,
      fusionId: fusionEventId,
      fusionSourceAddress,
      alertFrequency: config.alertFrequency,
      thresholdDirection: above ? 'above' : 'below',
      threshold:
        config.numberType === 'percentage' ? threshold / 100 : threshold,
    });
  }, [above, threshold]);

  const alertName = useMemo(() => {
    const now = new Date().toISOString();

    return `${config.name}:;:${now}:;:${
      above ? 'Above' : 'Below'
    }:;:${threshold.toFixed(2)}${
      config.numberType === 'percentage' ? '%' : ''
    }`;
  }, [config, above, threshold]);

  const subscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: FusionMultiThresholdEventTypeItem;
        inputs: Record<string, unknown>;
      }>,
      threshold: number,
      above: boolean,
    ): Promise<SubscriptionData> => {
      if (isUsingFrontendClient) {
        const fusionEventType: FusionEventTypeItem = {
          name: alertDetail.eventType.name,
          type: 'fusion',
          fusionEventId: alertDetail.eventType.fusionEventId,
          sourceAddress: alertDetail.eventType.sourceAddress,
          maintainSourceGroup: alertDetail.eventType.maintainSourceGroup,
          alertFrequency: alertDetail.eventType.alertFrequency,
          selectedUIType: 'HEALTH_CHECK',
          numberType: alertDetail.eventType.numberType,
          healthCheckSubtitle: '',
          checkRatios: [{ type: above ? 'above' : 'below', ratio: threshold }],
        };
        alertDetail.inputs[`${alertDetail.eventType.name}__healthRatio`] =
          threshold;
        alertDetail.inputs[
          `${alertDetail.eventType.name}__healthThresholdDirection`
        ] = above ? 'above' : 'below';
        return subscribeAlertByFrontendClient(frontendClient, {
          eventType: fusionEventType,
          inputs: alertDetail.inputs,
        });
      }
      if (!alertConfiguration)
        throw new Error('alertConfiguration is undefinded');

      return instantSubscribe({
        alertName,
        alertConfiguration,
      });
    },
    [isUsingFrontendClient, frontendClient],
  );

  return (
    <div
      className={clsx(
        'FusionMultiThresholdSettingsRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'FusionMultiThresholdSettingsRow__buttonContainer',
          classNames?.buttonContainer,
        )}
      >
        <button
          className={clsx(
            'FusionMultiThresholdSettingsRow__radioButton',
            classNames?.radioButton,
            { FusionMultiThresholdSettingsRow__radioSelected: above },
          )}
          onClick={() => setAbove(true)}
        >
          Above
        </button>
        <button
          className={clsx(
            'FusionMultiThresholdSettingsRow__radioButton',
            classNames?.radioButton,
            { FusionMultiThresholdSettingsRow__radioSelected: !above },
          )}
          onClick={() => setAbove(false)}
        >
          Below
        </button>
      </div>
      <div
        className={clsx(
          'FusionMultiThresholdSettingsRow__thresholdInputContainer',
          classNames?.thresholdInputContainer,
        )}
      >
        <input
          className={clsx(
            'FusionMultiThresholdSettingsRow__thresholdInput',
            classNames?.thresholdInput,
          )}
          name="notifi-fusionmultithreshold-threshold"
          type="number"
          inputMode="decimal"
          value={threshold}
          onChange={(e) => {
            setThreshold(e.target.valueAsNumber);
          }}
        />
      </div>
      <button
        className={clsx(
          'FusionMultiThresholdSettingsRow__saveButton',
          classNames?.saveButton,
        )}
        disabled={threshold === undefined}
        onClick={async () => {
          await subscribeAlert(
            {
              eventType: { ...config, name: alertName },
              inputs: inputs,
            },
            threshold,
            above,
          );
          frontendClient.fetchData().then(render);
          setAbove(true);
          setThreshold(0.0);
          onSave();
        }}
      >
        Save
      </button>
    </div>
  );
};
