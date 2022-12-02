import clsx from 'clsx';
import React from 'react';

export type NotifiToggleProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    input?: string;
    slider?: string;
  }>;
  disabled: boolean;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  intercomToggleStyle?: string;
}>;

export const NotifiToggle: React.FC<NotifiToggleProps> = ({
  classNames,
  disabled,
  checked,
  setChecked,
  intercomToggleStyle,
}: NotifiToggleProps) => {
  return (
    <label className={clsx('NotifiToggle__container', classNames?.container)}>
      <input
        className={clsx(
          'NotifiToggle__input',
          intercomToggleStyle,
          classNames?.input,
        )}
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
        }}
      />
      <span className={clsx('NotifiToggle__slider', classNames?.slider)}></span>
    </label>
  );
};
