import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const BellIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="-6 -6 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.49013 11.1875C6.12122 11.1875 6.63757 10.6712 6.63757 10.0401H4.3427C4.3427 10.6712 4.85331 11.1875 5.49013 11.1875ZM8.93244 7.74519V4.8766C8.93244 3.11529 7.99154 1.64083 6.35071 1.25071V0.860577C6.35071 0.384391 5.96632 0 5.49013 0C5.01395 0 4.62956 0.384391 4.62956 0.860577V1.25071C2.98299 1.64083 2.04783 3.10955 2.04783 4.8766V7.74519L0.900391 8.89263V9.46635H10.0799V8.89263L8.93244 7.74519Z"
        fill="currentColor"
      />
    </svg>
  );
};
