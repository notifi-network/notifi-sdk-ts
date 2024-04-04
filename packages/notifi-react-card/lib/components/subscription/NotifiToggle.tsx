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
}>;

export const NotifiToggle: React.FC<NotifiToggleProps> = ({
  classNames,
  disabled,
  checked,
  setChecked,
}: NotifiToggleProps) => {
  return (
    <label className={clsx('NotifiToggle__container', classNames?.container)}>
      <input
        className={clsx('NotifiToggle__input', classNames?.input)}
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
        }}
      />
      <span
        className={clsx('NotifiToggle__slider', classNames?.slider, {
          'NotifiToggleSlider--disabled': disabled,
        })}
      ></span>
    </label>
  );
};
