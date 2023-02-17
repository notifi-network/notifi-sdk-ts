import React from 'react';

import { CloseIcon } from '../../assets/CloseIcon';
import { SettingIcon } from '../../assets/SettingIcon';
import { BackArrow } from '../../assets/backArrow';
import { NotifiLogo } from '../NotifiLogo';

const icons = {
  back: BackArrow,
  close: CloseIcon,
  settings: SettingIcon,
  logo: NotifiLogo,
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
