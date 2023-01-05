import React from 'react';

import { RatioCheckIcon } from '../../assets/RatioCheckIcon';
import { AlertNotificationRow } from './AlertNotificationRow';

type HealthValueOverThresholdEventRendererProps = Readonly<{
  createdDate: string;
  name: string | undefined;
  threshold: string | undefined;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
}>;

export const HealthValueOverThresholdEventRenderer: React.FC<
  HealthValueOverThresholdEventRendererProps
> = ({
  name,
  threshold,
  createdDate,
  notificationTitle,
  handleAlertEntrySelection,
}) => {
  return (
    <AlertNotificationRow
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={notificationTitle}
      notificationImage={<RatioCheckIcon />}
      notificationSubject={`${name} over ${threshold}`}
      notificationDate={createdDate}
      notificationMessage={undefined}
    />
  );
};
