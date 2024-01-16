import React from 'react';

import { NavbarIconBellDisabled } from '../assets/NavbarIconBellDisabled';
import { NavbarIconBellEnabled } from '../assets/NavbarIconBellEnabled';
import { NavbarIconGearDisabled } from '../assets/NavbarIconGearDisabled';
import { NavbarIconGearEnabled } from '../assets/NavbarIconGearEnabled';

const navbarIcons = {
  NavbarIconBellEnabled,
  NavbarIconBellDisabled,
  NavbarIconGearDisabled,
  NavbarIconGearEnabled,
} as const;

type Props = React.SVGProps<SVGSVGElement> &
  Readonly<{ icon: keyof typeof navbarIcons }>;

export const NavbarIcon: React.FC<Props> = ({ icon, ...props }) => {
  const Renderer = navbarIcons[icon];
  return <Renderer {...props} />;
};
