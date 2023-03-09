import React from 'react';

import { BackArrowIcon } from '../../assets/BackArrowIcon';
import { CloseIcon } from '../../assets/CloseIcon';
import { SettingIcon } from '../../assets/SettingIcon';

const icons = {
  back: BackArrowIcon,
  close: CloseIcon,
  settings: SettingIcon,
} as const;

export type AlertActionIconProps = Readonly<{
  name: keyof typeof icons;
  className?: string;
}>;

const AlertActionIcon: React.FC<AlertActionIconProps> = ({
  name,
  className,
}) => {
  const View = icons[name];
  return <View className={className} />;
};

export default AlertActionIcon;
