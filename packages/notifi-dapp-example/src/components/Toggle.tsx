import React from 'react';

export type ToggleProps = Readonly<{
  disabled: boolean;
  checked: boolean;
  onChange?: () => void;
  handleChange?: (val: boolean) => void;
}>;

export const Toggle: React.FC<ToggleProps> = ({
  disabled,
  checked,
  onChange,
  handleChange,
}: ToggleProps) => {
  return (
    <label
      className={`${
        disabled ? 'opacity-70 cursor-wait' : 'cursor-pointer'
      } relative inline-flex items-center  h-5`}
    >
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          handleChange?.(e.target.checked);
          onChange?.();
        }}
      />
      <div className="w-7 h-4 rounded-full peer bg-notifi-toggle-off-bg peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:right-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-notifi-toggle-on-bg relative"></div>
      <div className="absolute w-[4px] h-[4px] top-[8px] left-[6px] peer-checked:top-[8px] peer-checked:start-[18px] bg-notifi-toggle-off-dot-bg peer-checked:bg-notifi-toggle-on-bg rounded-[56px] shadow-regular-shadow-small" />
    </label>
  );
};
