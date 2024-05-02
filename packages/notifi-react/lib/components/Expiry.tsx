import React from 'react';

import { defaultCopy } from '../utils/constants';
import { Connect } from './Connect';

export type ExpiryProps = {
  copy?: {
    title?: string;
    content?: string;
    buttonText?: string;
  };
  classNames?: {
    container?: string;
    icon?: string;
    header?: string;
    content?: string;
    button?: string;
  };
};

export const Expiry: React.FC<ExpiryProps> = (props) => {
  return (
    <Connect
      copy={props.copy ?? defaultCopy.expiry}
      classNames={
        props.classNames ?? {
          container: 'notifi-expiry',
          icon: 'notifi-expiry-icon',
          header: 'notifi-expiry-title',
          content: 'notifi-expiry-content',
          button: 'notifi-expiry-button',
        }
      }
    />
  );
};
