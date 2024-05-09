import React from 'react';

export type ToggleProps = Readonly<{
  disabled: boolean;
  checked: boolean;
  onChange?: () => void;
}>;

export const Toggle: React.FC<ToggleProps> = ({
  disabled,
  checked,
  onChange,
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
        onChange={() => {
          onChange?.();
        }}
      />
      <div className="w-7 h-4 rounded-full peer bg-notifi-toggle-off-bg peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:right-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-notifi-toggle-on-bg relative"></div>
    </label>
  );
};
