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
  FusionMultiThreshholdEventTypeItem,
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

export type EventTypeFusionMultiThreshholdRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    content: string;
    label: string;
    addThreshhold: string;
    tooltip: NotifiTooltipProps['classNames'];
    fusionMultiThreshholdAlertRow: FusionMultiThreshholdAlertRowProps['classNames'];
    fusionMultiThreshholdSettingsRow: FusionMultiThreshholdSettingsRowProps['classNames'];
  }>;
  config: FusionMultiThreshholdEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeFusionMultiThreshholdRow: React.FC<
  EventTypeFusionMultiThreshholdRowProps
> = ({
  classNames,
  config,
  inputs,
}: EventTypeFusionMultiThreshholdRowProps) => {
  const { name, tooltipContent } = config;
  const { alerts } = useNotifiSubscriptionContext();

  const fusionMultiThreshholdAlertNames = useMemo(() => {
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
      setShowInput(fusionMultiThreshholdAlertNames.length === 0);
    }
  }, [alerts, fusionMultiThreshholdAlertNames]);

  return (
    <div
      className={clsx(
        'EventTypeFusionMultiThreshholdRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'EventTypeFusionMultiThreshholdRow__label',
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
          'EventTypeFusionMultiThreshholdRow__content',
          classNames?.content,
        )}
      >
        {config.subtitle
          ? config.subtitle
          : `Alert me when my margin ratio is:`}
      </div>
      {fusionMultiThreshholdAlertNames.map((alertName) => {
        return (
          <FusionMultiThreshholdAlertRow
            key={alertName}
            classNames={classNames?.fusionMultiThreshholdAlertRow}
            alertName={alertName}
            inputs={inputs}
          />
        );
      })}
      {showInput ? (
        <FusionMultiThreshholdSettingsRow
          classNames={classNames?.fusionMultiThreshholdSettingsRow}
          config={config}
          inputs={inputs}
          onSave={() => {
            setShowInput(false);
          }}
        />
      ) : null}
      <button
        className={clsx(
          'EventTypeFusionMultiThreshholdRow__addThreshhold',
          classNames?.addThreshhold,
        )}
        disabled={showInput}
        onClick={() => {
          setShowInput(true);
        }}
      >
        {config.addThreshholdTitle ? config.addThreshholdTitle : 'Add alert'}
      </button>
    </div>
  );
};

export type FusionMultiThreshholdAlertRowProps = Readonly<{
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

export const FusionMultiThreshholdAlertRow: React.FC<
  FusionMultiThreshholdAlertRowProps
> = ({ classNames, alertName, inputs }: FusionMultiThreshholdAlertRowProps) => {
  const { render } = useNotifiSubscriptionContext();

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const { isUsingFrontendClient, frontendClient } = useNotifiClientContext();

  const name = useMemo(() => {
    const [, , above, threshhold] = alertName.split(':;:');
    return above + ' ' + threshhold;
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
        'FusionMultiThreshholdAlertRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'FusionMultiThreshholdAlertRow__textContainer',
          classNames?.textContainer,
        )}
      >
        <span
          className={clsx(
            'FusionMultiThreshholdAlertRow__name',
            classNames?.name,
          )}
        >
          {name}
        </span>
      </div>
      <div
        className={clsx(
          'FusionMultiThreshholdAlertRow__deleteIcon',
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
export type FusionMultiThreshholdSettingsRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    buttonContainer: string;
    radioButton: string;
    container: string;
    label: string;
    option: string;
    threshholdInput: string;
    threshholdInputContainer: string;
    saveButton: string;
  }>;
  config: FusionMultiThreshholdEventTypeItem;
  inputs: Record<string, unknown>;
  onSave: () => void;
}>;

export const FusionMultiThreshholdSettingsRow: React.FC<
  FusionMultiThreshholdSettingsRowProps
> = ({
  classNames,
  config,
  inputs,
  onSave,
}: FusionMultiThreshholdSettingsRowProps) => {
  const [above, setAbove] = useState<boolean>(true);
  const [threshhold, setThreshhold] = useState<number>(0.0);
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
        config.numberType === 'percentage' ? threshhold / 100 : threshhold,
    });
  }, [above, threshhold]);

  const alertName = useMemo(() => {
    const now = new Date().toISOString();

    return `${config.name}:;:${now}:;:${
      above ? 'Above' : 'Below'
    }:;:${threshhold.toFixed(2)}${
      config.numberType === 'percentage' ? '%' : ''
    }`;
  }, [config, above, threshhold]);

  const subscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: FusionMultiThreshholdEventTypeItem;
        inputs: Record<string, unknown>;
      }>,
      threshhold: number,
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
          checkRatios: [{ type: above ? 'above' : 'below', ratio: threshhold }],
        };
        alertDetail.inputs[`${alertDetail.eventType.name}__healthRatio`] =
          threshhold;
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
        'FusionMultiThreshholdSettingsRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'FusionMultiThreshholdSettingsRow__buttonContainer',
          classNames?.buttonContainer,
        )}
      >
        <button
          className={clsx(
            'FusionMultiThreshholdSettingsRow__radioButton',
            classNames?.radioButton,
            { FusionMultiThreshholdSettingsRow__radioSelected: above },
          )}
          onClick={() => setAbove(true)}
        >
          Above
        </button>
        <button
          className={clsx(
            'FusionMultiThreshholdSettingsRow__radioButton',
            classNames?.radioButton,
            { FusionMultiThreshholdSettingsRow__radioSelected: !above },
          )}
          onClick={() => setAbove(false)}
        >
          Below
        </button>
      </div>
      <div
        className={clsx(
          'FusionMultiThreshholdSettingsRow__threshholdInputContainer',
          classNames?.threshholdInputContainer,
        )}
      >
        <input
          className={clsx(
            'FusionMultiThreshholdSettingsRow__threshholdInput',
            classNames?.threshholdInput,
          )}
          name="notifi-fusionmultithreshhold-threshhold"
          type="number"
          inputMode="decimal"
          value={threshhold}
          onChange={(e) => {
            setThreshhold(e.target.valueAsNumber);
          }}
        />
      </div>
      <button
        className={clsx(
          'FusionMultiThreshholdSettingsRow__saveButton',
          classNames?.saveButton,
        )}
        disabled={threshhold === undefined}
        onClick={async () => {
          await subscribeAlert(
            {
              eventType: { ...config, name: alertName },
              inputs: inputs,
            },
            threshhold,
          );
          frontendClient.fetchData().then(render);
          setAbove(true);
          setThreshhold(0.0);
          onSave();
        }}
      >
        Save
      </button>
    </div>
  );
};
