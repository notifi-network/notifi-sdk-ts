import clsx from 'clsx';
import React from 'react';
import { useNotifiSubscriptionContext } from '../context';

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
  const { cardView } = useNotifiSubscriptionContext();

  const hideFooter = cardView.state === 'history';

  return hideFooter ? null : (
    <div className={clsx('NotifiFooter__container', classNames?.container)}>
      <span
        style={{ marginBottom: 0 }}
        className={clsx('NotifiFooter__poweredBy', classNames?.poweredBy)}
      >
        {copy?.poweredBy ?? 'Powered by'}
      </span>
      <NotifiLogo
        className={clsx('NotifiFooter__logoSvg', classNames?.logoSvg)}
      />
    </div>
  );
};
