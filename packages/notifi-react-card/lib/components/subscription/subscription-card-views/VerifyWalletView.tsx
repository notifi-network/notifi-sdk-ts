import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../../../context';
import { WalletList } from '../../WalletList';
import NotifiCardButton, {
  NotifiCardButtonProps,
} from '../../common/NotifiCardButton';

export type VerifyWalletViewProps = Readonly<{
  classNames?: Readonly<{
    NotifiVerifyContainer?: string;
    NotifiInputHeading?: string;
    NotifiCardButtonProps?: NotifiCardButtonProps['classNames'];
  }>;
  buttonText: string;
}>;

const VerifyWalletView: React.FC<VerifyWalletViewProps> = ({
  classNames,
  buttonText,
}) => {
  const { setCardView } = useNotifiSubscriptionContext();

  const onClick = () => {
    setCardView({ state: 'preview' });
  };

  return (
    <div
      className={clsx(
        'NotifiVerifyContainer',
        classNames?.NotifiVerifyContainer,
      )}
    >
      <WalletList />
      <NotifiCardButton buttonText={buttonText} onClick={onClick} />
    </div>
  );
};

export default VerifyWalletView;
