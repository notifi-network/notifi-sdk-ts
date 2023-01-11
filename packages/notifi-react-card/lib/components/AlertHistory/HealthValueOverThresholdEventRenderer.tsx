import React from 'react';

import { RatioCheckIcon } from '../../assets/RatioCheckIcon';
import { AlertNotificationRow } from './AlertNotificationRow';

type HealthValueOverThresholdEventRendererProps = Readonly<{
  createdDate: string;
  name: string | undefined;
  threshold: string;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
  value: string;
}>;

export const HealthValueOverThresholdEventRenderer: React.FC<
  HealthValueOverThresholdEventRendererProps
> = ({
  name,
  threshold,
  createdDate,
  notificationTitle,
  value,
  handleAlertEntrySelection,
}) => {
  let thresholdDirection = '';
  if (parseFloat(value) > parseFloat(threshold)) {
    thresholdDirection = 'under';
  } else {
    thresholdDirection = 'over';
  }
  return (
    <AlertNotificationRow
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={notificationTitle}
      notificationImage={<RatioCheckIcon />}
      notificationSubject={`${name} ${thresholdDirection} ${threshold}`}
      notificationDate={createdDate}
      notificationMessage={undefined}
    />
  );
};
