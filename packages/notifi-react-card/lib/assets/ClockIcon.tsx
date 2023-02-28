import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const ClockIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="12px"
      width="12px"
      version="1.1"
      id="clock_icon"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM5.25 2V6.5V6.81066L5.46967 7.03033L7.96967 9.53033L9.03033 8.46967L6.75 6.18934V2H5.25Z"
        fill="currentColor"
      />
    </svg>
  );
};
