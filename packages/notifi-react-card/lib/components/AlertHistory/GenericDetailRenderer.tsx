import React from 'react';

import { AnnouncementIcon } from '../../assets/AnnouncementIcon';
import { Checkmark } from '../../assets/Checkmark';
import { ClockIcon } from '../../assets/ClockIcon';
import { DownArrowIcon } from '../../assets/DownArrowIcon';
import { RatioCheckIcon } from '../../assets/RatioCheckIcon';
import { StarIcon } from '../../assets/StarIcon';
import { UpArrowIcon } from '../../assets/UpArrowIcon';
import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from './AlertNotificationRow';

type GenericDetailRendererProps = Readonly<{
  createdDate: string;
  message: string | undefined;
  subject: string | undefined;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
  icon: string;
}>;

export const GenericDetailRenderer: React.FC<GenericDetailRendererProps> = ({
  message,
  subject,
  createdDate,
  notificationTitle,
  handleAlertEntrySelection,
  classNames,
  icon,
}) => {
  return (
    <AlertNotificationRow
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={notificationTitle}
      notificationImage={<GenericDetailIcon icon={icon} />}
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
      classNames={classNames}
    />
  );
};

type GenericDetailIconProps = Readonly<{
  icon: string;
}>;

const GenericDetailIcon: React.FC<GenericDetailIconProps> = ({
  icon,
}: GenericDetailIconProps) => {
  switch (icon) {
    case 'UP_ARROW':
      return <UpArrowIcon className="GenericDetailIcon" />;
    case 'DOWN_ARROW':
      return <DownArrowIcon className="GenericDetailIcon" />;
    case 'PERCENT':
      return <RatioCheckIcon className="GenericDetailIcon" />;
    case 'CLOCK':
      return <ClockIcon className="GenericDetailIcon" />;
    case 'CHECKMARK':
      return <Checkmark className="GenericDetailIcon" />;
    case 'STAR':
      return <StarIcon className="GenericDetailIcon" />;
    default:
    case 'MEGAPHONE':
      return <AnnouncementIcon className="GenericDetailIcon" />;
  }
};
