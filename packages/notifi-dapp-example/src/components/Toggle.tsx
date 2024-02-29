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
        onChange={onChange}
      />
      {/* <div className="relative"> */}
      <div className="w-7 h-4 rounded-full peer bg-notifi-toggle-off-bg peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:right-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-notifi-toggle-on-bg relative"></div>
      {/* <div className="absolute flex items-center justify-center w-1 h-1 transition bg-black rounded-full left-1 top-1 peer-checked:translate-x-full peer-checked:bg-primary"></div> */}
      {/* <div className="absolute w-[12px] h-[12px] top-1px left-[20px] bg-backgroundwhite rounded-[56px] border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-borderwhite shadow-toggle-shadow-toggle-active" /> */}
      <div className="absolute w-[4px] h-[4px] top-[8px] left-[6px] peer-checked:top-[8px] peer-checked:start-[18px] bg-notifi-toggle-off-dot-bg peer-checked:bg-notifi-toggle-on-bg rounded-[56px] shadow-regular-shadow-small" />
      {/* <span className="hidden active"> */}
      {/* <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
              fill="white"
              stroke="white"
              stroke-width="0.4"
            />
          </svg>
        </span> */}
      {/* </div> */}
    </label>
  );
};
