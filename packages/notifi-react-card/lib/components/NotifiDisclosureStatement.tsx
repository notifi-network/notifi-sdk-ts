import clsx from 'clsx';
import React from 'react';

import { DeepPartialReadonly } from '../utils';

export type NotifiDisclosureStatementProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    hyperlink: string;
  }>;
  disclosureCopy: string;
}>;
export const NotifiDisclosureStatement: React.FC<
  NotifiDisclosureStatementProps
> = ({ classNames, disclosureCopy }) => {
  return (
    <div className={clsx('NotifiDisclosure__container', classNames?.container)}>
      <label className={clsx('NotifiDisclosure__label', classNames?.label)}>
        {disclosureCopy}{' '}
      </label>
      <a
        className={clsx('NotifiDisclosure__hyperlink', classNames?.hyperlink)}
        href="https://notifi.network"
        target="_blank"
      >
        Learn more
      </a>
    </div>
  );
};
