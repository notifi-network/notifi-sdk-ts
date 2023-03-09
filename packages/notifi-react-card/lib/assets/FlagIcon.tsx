import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const FlagIcon: React.FC<Props> = (props: Props) => {
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
        d="M14.1882 7.52941L13.8824 6H7V19H8.52941V13.6471H12.8118L13.1176 15.1765H18.4706V7.52941H14.1882Z"
        fill="currentColor"
      />
    </svg>
  );
};
