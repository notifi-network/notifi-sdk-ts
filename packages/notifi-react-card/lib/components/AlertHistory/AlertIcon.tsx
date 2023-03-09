import React from 'react';

import { AnnouncementIcon } from '../../assets/AnnouncementIcon';
import { ChartIcon } from '../../assets/ChartIcon';
import { CheckIcon } from '../../assets/CheckIcon';
import { ClockIcon } from '../../assets/ClockIcon';
import { DaoIcon } from '../../assets/DaoIcon';
import { DownArrowIcon } from '../../assets/DownArrowIcon';
import { FlagIcon } from '../../assets/FlagIcon';
import { GraphIcon } from '../../assets/GraphIcon';
import { InfoIcon } from '../../assets/InfoIcon';
import { RatioCheckIcon } from '../../assets/RatioCheckIcon';
import { StarIcon } from '../../assets/StarIcon';
import { SwapIcon } from '../../assets/SwapIcon';
import { UpArrowIcon } from '../../assets/UpArrowIcon';
import { UrgentIcon } from '../../assets/UrgentIcon';
import { WatchIcon } from '../../assets/WatchIcon';

const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  UP_ARROW: UpArrowIcon,
  DOWN_ARROW: DownArrowIcon,
  PERCENT: RatioCheckIcon,
  CLOCK: ClockIcon,
  CHECKMARK: CheckIcon,
  STAR: StarIcon,
  MEGAPHONE: AnnouncementIcon,
  CHART: ChartIcon,
  DAO: DaoIcon,
  FLAG: FlagIcon,
  GRAPH: GraphIcon,
  INFO: InfoIcon,
  SWAP: SwapIcon,
  URGENT: UrgentIcon,
  WATCH: WatchIcon,
};

export type Props = React.SVGProps<SVGSVGElement> & Readonly<{ icon: string }>;

export const AlertIcon: React.FC<Props> = ({ icon, ...props }: Props) => {
  const Renderer = icons[icon] ?? AnnouncementIcon;
  return <Renderer {...props} />;
};
