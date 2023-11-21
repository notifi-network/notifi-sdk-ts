import { CardConfigItemV2 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React from 'react';

import { CheckIcon } from '../../../assets/CheckIcon';

export type AlertListPreviewProps = Readonly<{
  alertList?: DeepPartialReadonly<{
    container: string;
    listItem: string;
  }>;
  eventTypes: CardConfigItemV2['topicTypes'];
  // TODO: MVP-3655
  copy?: DeepPartialReadonly<{
    description: string;
  }>;
  // TODO: MVP-3655
  classNames?: DeepPartialReadonly<{
    checkmarkIcon: string;
    container: string;
    description: string;
    eventListItem: string;
  }>;
}>;

export const TopicListPreview: React.FC<AlertListPreviewProps> = ({
  eventTypes,
  copy,
  classNames,
}: AlertListPreviewProps) => {
  const alertNames = eventTypes.map((topicType) => {
    return (
      <div className="NotifiAlertList__listItem" key={topicType.name}>
        <CheckIcon
          className={clsx(
            'NotifiAlertListContainer__checkmarkIcon',
            classNames?.checkmarkIcon,
          )}
        />
        <label
          className={clsx(
            'NotifiAlertListContainer__listItemContent',
            classNames?.eventListItem,
          )}
          key={topicType.name}
        >
          {topicType.type === 'fusion'
            ? topicType.displayNameOverride ?? topicType.name
            : topicType.name}
        </label>
      </div>
    );
  });

  return (
    <div
      className={clsx(
        'NotifiAlertListContainer__container',
        classNames?.container,
      )}
    >
      <label
        className={clsx(
          'NotifiAlertListPreview__descriptionText',
          classNames?.description,
        )}
      >
        {copy?.description ?? 'Subscribe to any of these alerts'}
      </label>
      <div className={clsx('NotifiAlertLisPreview__checkmarkContainer')}>
        {alertNames}
      </div>
    </div>
  );
};
