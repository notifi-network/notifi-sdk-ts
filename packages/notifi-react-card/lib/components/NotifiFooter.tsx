import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';
import {
  NotifiDisclosureStatement,
  NotifiDisclosureStatementProps,
} from './NotifiDisclosureStatement';
import { NotifiLogo } from './NotifiLogo';

export type NotifiFooterProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    poweredBy: string;
    logoSvg: string;
    link: string;
    spacer: string;
    disclosure: NotifiDisclosureStatementProps['classNames'];
  }>;
  copy?: DeepPartialReadonly<{
    poweredBy: string;
    learnMore: string;
    disclosure: string;
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
      {copy?.disclosure ? (
        <NotifiDisclosureStatement
          disclosureCopy={copy?.disclosure}
          classNames={classNames?.disclosure}
        />
      ) : null}
      <a
        href="https://notifi.network/faqs"
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'NotifiFooter__poweredByContainer',
          classNames?.container,
        )}
      >
        <span
          className={clsx('NotifiFooter__poweredBy', classNames?.poweredBy)}
        >
          {copy?.poweredBy ?? 'Powered by'}
        </span>
        <NotifiLogo
          className={clsx('NotifiFooter__logoSvg', classNames?.logoSvg)}
        />
      </a>
    </div>
  );
};
