import { CardConfigItemV2 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import {
  EventTypeFusionHealthCheckRow,
  EventTypeFusionHealthCheckRowProps,
} from '../EventTypeFusionHealthCheckRow';
import {
  EventTypeFusionMultiThresholdRow,
  EventTypeFusionMultiThresholdRowProps,
} from '../EventTypeFusionMultiThresholdRow';
import {
  EventTypeFusionRowProps,
  EventTypeFusionToggleRow,
} from '../EventTypeFusionToggleRow';

export type AlertsPanelProps = Readonly<{
  data: CardConfigItemV2;
  inputDisabled: boolean;
  // TODO: MVP-3655
  classNames?: Readonly<{
    EventTypeContainer?: string;
    EventTypeFusionMultiThresholdRow?: EventTypeFusionMultiThresholdRowProps['classNames'];
    EventTypeFusionToggleRow?: EventTypeFusionRowProps['classNames'];
    EventTypeFusionHealthCheckRow?: EventTypeFusionHealthCheckRowProps['classNames'];
  }>;
  inputs: Record<string, unknown>;
}>;
export const TopicsPanel: React.FC<AlertsPanelProps> = ({
  data,
  inputDisabled,
  classNames,
  inputs,
}) => {
  return (
    <div
      className={clsx(
        'NotifiEventTypeContainer',
        classNames?.EventTypeContainer,
      )}
    >
      {data.topicTypes.map((topicType) => {
        switch (topicType.selectedUIType) {
          case 'HEALTH_CHECK':
            return (
              // TODO: MVP-3698
              <EventTypeFusionHealthCheckRow
                key={topicType.name}
                disabled={inputDisabled}
                config={topicType}
                classNames={classNames?.EventTypeFusionHealthCheckRow}
                inputs={inputs}
              />
            );
          case 'TOGGLE':
            return (
              // TODO:  MVP-3698
              <EventTypeFusionToggleRow
                key={topicType.name}
                classNames={classNames?.EventTypeFusionToggleRow}
                disabled={inputDisabled}
                config={topicType}
                inputs={inputs}
              />
            );
          case 'MULTI_THRESHOLD':
            return (
              // TODO: MVP-3698
              <EventTypeFusionMultiThresholdRow
                key={topicType.name}
                classNames={classNames?.EventTypeFusionMultiThresholdRow}
                config={topicType}
                inputs={inputs}
              />
            );
          default:
            throw new Error(`Unknown UI type`);
        }
      })}
    </div>
  );
};
