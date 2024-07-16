import clsx from 'clsx';
import React from 'react';

export type ToggleProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    input?: string;
    slider?: string;
  }>;
  disabled: boolean;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export const Toggle: React.FC<ToggleProps> = ({
  classNames,
  disabled,
  checked,
  setChecked,
}: ToggleProps) => {
  return (
    <label className={clsx('notifi-toggle-container', classNames?.container)}>
      <input
        className={clsx('notifi-toggle-input', classNames?.input)}
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
        }}
      />
      <span
        className={clsx('notifi-toggle-slider', classNames?.slider, {
          'notifi-toggle-slider--disabled': disabled,
        })}
      ></span>
    </label>
  );
};
