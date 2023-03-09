import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const DaoIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.0623 7.92265L12.0002 5L6.93799 7.92265L12.0002 10.8453L17.0623 7.92265ZM12.0002 12L5.93799 8.5V15.5L12.0002 19L18.0623 15.5V8.5L12.0002 12Z"
        fill="currentColor"
      />
    </svg>
  );
};
