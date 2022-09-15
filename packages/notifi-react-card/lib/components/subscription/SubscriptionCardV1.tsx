import { NotifiEmailInput } from '..';
import { CardConfigItemV1 } from '../../hooks';
import React from 'react';

type Props = Readonly<{
  data: CardConfigItemV1;
}>;

export const SubscriptionCardV1: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput disabled={false} />
      ) : null}
    </>
  );
};
