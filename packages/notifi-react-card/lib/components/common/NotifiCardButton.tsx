import clsx from 'clsx';
import React from 'react';

export type NotifiCardButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  buttonText: string;
  disabled?: boolean;
  onClick?: () => void;
}>;

const NotifiCardButton: React.FC<NotifiCardButtonProps> = ({
  buttonText,
  classNames,
  disabled,
  onClick,
}) => {
  return (
    <button
      className={clsx('NotifiCardButton__button', classNames?.button)}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={clsx('NotifiCardButtonn__label', classNames?.label)}>
        {buttonText}
      </span>
    </button>
  );
};

export default NotifiCardButton;
