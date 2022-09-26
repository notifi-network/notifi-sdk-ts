import clsx from 'clsx';
import React from 'react';

import type { DeepPartialReadonly } from '../utils';
import { NotifiLogo } from './NotifiLogo';

export type NotifiFooterProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    poweredBy: string;
    logoSvg: string;
    link: string;
    spacer: string;
  }>;
  copy?: DeepPartialReadonly<{
    poweredBy: string;
    learnMore: string;
  }>;
}>;

export const NotifiFooter: React.FC<NotifiFooterProps> = ({
  classNames,
  copy,
}: NotifiFooterProps) => {
  return (
    <div className={clsx('NotifiFooter__container', classNames?.container)}>
      <span className={clsx('NotifiFooter__poweredBy', classNames?.poweredBy)}>
        {copy?.poweredBy ?? 'Powered by'}
      </span>
      <NotifiLogo
        className={clsx('NotifiFooter__logoSvg', classNames?.logoSvg)}
      />
      <span className={clsx('NotifiFooter__spacer', classNames?.spacer)} />
      <span className={clsx('NotifiFooter__link', classNames?.link)}>
        <a
          href="https://notifi.network/faqs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy?.learnMore ?? 'Learn more'}
        </a>
      </span>
    </div>
  );
};
