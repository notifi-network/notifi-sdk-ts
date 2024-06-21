import React from 'react';

import { Connect } from './Connect';
import { CardModalView } from './NotifiCardModal';

export type ExpiryProps = {
  setCardModalView: React.Dispatch<React.SetStateAction<CardModalView | null>>;
};

export const Expiry: React.FC<ExpiryProps> = (props) => {
  return (
    <Connect
      setCardModalView={props.setCardModalView}
      loginWithoutSubscription={true}
    />
  );
};
