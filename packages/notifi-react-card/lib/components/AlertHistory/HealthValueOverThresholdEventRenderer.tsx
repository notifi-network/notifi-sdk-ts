import React from 'react';

import { AnnouncementIcon } from '../../assets/AnnouncementIcon';
import { AlertNotificationRow } from './AlertNotificationRow';

type HealthValueOverThresholdEventRendererProps = Readonly<{
  createdDate: string;
  name: string | undefined;
  threshold: string | undefined;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
  healthCheckIcon?: JSX.Element;
}>;

export const HealthValueOverThresholdEventRenderer: React.FC<
  HealthValueOverThresholdEventRendererProps
> = ({
  name,
  threshold,
  createdDate,
  notificationTitle,
  handleAlertEntrySelection,
  healthCheckIcon,
}) => {
  const getDefaultIcon = () => {
    return healthCheckIcon || <AnnouncementIcon />;
  };
  return (
    <AlertNotificationRow
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={notificationTitle}
      notificationImage={getDefaultIcon()}
      notificationSubject={`${name} over ${threshold}`}
      notificationDate={createdDate}
    />
  );
};
