import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const ChartIcon: React.FC<Props> = (props: Props) => {
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
        d="M17.0556 5.5H6.94444C6.15 5.5 5.5 6.15 5.5 6.94444V17.0556C5.5 17.85 6.15 18.5 6.94444 18.5H17.0556C17.85 18.5 18.5 17.85 18.5 17.0556V6.94444C18.5 6.15 17.85 5.5 17.0556 5.5ZM9.83333 15.6111H8.38889V10.5556H9.83333V15.6111ZM12.7222 15.6111H11.2778V8.38889H12.7222V15.6111ZM15.6111 15.6111H14.1667V12.7222H15.6111V15.6111Z"
        fill="currentColor"
      />
    </svg>
  );
};
