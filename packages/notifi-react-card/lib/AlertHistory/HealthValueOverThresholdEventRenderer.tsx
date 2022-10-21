import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type HealthValueOverThresholdRendererProps = Readonly<{
  name: string;
  value: string;
  threshold: string;
  url: string;
  createdDate: string;
}>;

export const HealthValueOverThresholdRenderer: React.FC<
  HealthValueOverThresholdRendererProps
> = ({ name, value, threshold, url, createdDate }) => {
  const getTitle = () => {
    return `New message from ${name}`;
  };

  const getMessage = () => {
    return `Value ${value} is over threshold ${threshold} in ${name}. For more details, please visit ${url}`;
  };
  return (
    <AlertNotificationRow
      notificationSubject={getTitle()}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
    />
  );
};
