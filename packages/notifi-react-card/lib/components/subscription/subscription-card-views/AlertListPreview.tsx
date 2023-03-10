import clsx from 'clsx';
import { CardConfigItemV1 } from 'notifi-react-card/lib/hooks';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React from 'react';

import { CheckIcon } from '../../../assets/CheckIcon';

export type AlertListPreviewProps = Readonly<{
  alertList?: DeepPartialReadonly<{
    container: string;
    listItem: string;
  }>;
  eventTypes: CardConfigItemV1['eventTypes'];
  copy?: DeepPartialReadonly<{
    headerText: string;
    description: string;
  }>;
  classNames?: DeepPartialReadonly<{
    checkmarkIcon: string;
    container: string;
    description: string;
    headerText: string;
    eventListItem: string;
  }>;
}>;

export const AlertListPreview: React.FC<AlertListPreviewProps> = ({
  eventTypes,
  copy,
  classNames,
}: AlertListPreviewProps) => {
  const alertNames = eventTypes.map((eventType) => {
    // skip showing alert previews for labels
    if (eventType.type === 'label') {
      return;
    }
    return (
      <div className="NotifiAlertList__listItem" key={eventType.name}>
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
          key={eventType.name}
        >
          {eventType.name}
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
          'NotifiAlertListPreview__headerText',
          classNames?.headerText,
        )}
      >
        {copy?.headerText ?? 'Get Notifications'}
      </label>
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
