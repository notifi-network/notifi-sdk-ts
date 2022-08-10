import React from 'react';

import type { DeepPartialReadonly } from '../utils';
import { NotifiLogo } from './NotifiLogo';

type Props = Readonly<{
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

export const NotifiFooter: React.FC<Props> = ({ classNames, copy }: Props) => {
  return (
    <div className={classNames?.container}>
      <span className={classNames?.poweredBy}>
        {copy?.poweredBy ?? 'Powered by'}
      </span>
      <NotifiLogo className={classNames?.logoSvg} />
      <span className={classNames?.spacer} />
      <span className={classNames?.link}>
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
