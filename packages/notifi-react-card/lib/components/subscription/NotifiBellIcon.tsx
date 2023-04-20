import clsx from 'clsx';
import React from 'react';
import { PropsWithChildren, useState } from 'react';

import { BellIcon } from '../../assets/BellIcon';

type Props = { color: string };

type NotifiBellIconProps = {
  svgProps?: Props;
  bellColor?: string;
  classNames?: Readonly<{
    NotifiBellIcon: string;
  }>;
  containerStyles?: React.CSSProperties;
};

export const NotifiBellIcon: React.FC<
  PropsWithChildren<NotifiBellIconProps>
> = ({ children, svgProps, bellColor, classNames, containerStyles }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        className={clsx('NotifiBellIcon', classNames?.NotifiBellIcon)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellIcon bellColor={bellColor} {...svgProps} />
      </div>
      <div
        style={{
          width: 'min(40ch, 75ch)',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'absolute',
          top: '50px',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: isOpen
            ? 'opacity 0.2s ease-out, transform 0.2s ease-out'
            : 'opacity 0.05s ease-out, transform 0.05s ease-out',
          ...containerStyles,
        }}
      >
        <div
          style={{
            opacity: 0,
            transform: 'translateY(50px)',
            transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
            ...(isOpen && {
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
            }),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
