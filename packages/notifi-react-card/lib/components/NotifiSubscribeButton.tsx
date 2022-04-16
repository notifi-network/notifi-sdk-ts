import { useNotifiCopyContext, useNotifiStyleContext } from '../context';
import React from 'react';

type Props = Readonly<{
  disabled: boolean;
  label?: React.ReactChild;
  onClick: () => void;
}>;

export const NotifiSubscribeButton: React.FC<Props> = ({
  disabled,
  label,
  onClick,
}: Props) => {
  const { subscribeButton: styles } = useNotifiStyleContext();
  const { subscribeButton: copy } = useNotifiCopyContext();

  return (
    <div className={styles?.container}>
      <button
        className={styles?.button}
        disabled={disabled}
        onClick={onClick}
        type="submit"
      >
        {label ?? copy?.subscribe ?? 'Subscribe'}
      </button>
    </div>
  );
};
