import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { PropsWithChildren } from 'react';

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
  const bellIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bellIconRef.current &&
        !bellIconRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={bellIconRef}
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
