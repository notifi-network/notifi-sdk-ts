import React from 'react';

export type ToggleProps = Readonly<{
  disabled: boolean;
  checked: boolean;
}>;

export const Toggle: React.FC<ToggleProps> = ({
  disabled,
  checked,
}: ToggleProps) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
      />
      <div className="w-9 h-5 rounded-full peer dark:bg-notifi-toggle-off-bg peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-notifi-toggle-on-bg"></div>
    </label>
  );
};
