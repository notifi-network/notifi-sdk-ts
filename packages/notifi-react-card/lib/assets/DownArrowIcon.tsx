import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const DownArrowIcon: React.FC<Props> = (props: Props) => {
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
        d="M8 13.4705L12 16.9999M12 16.9999L16 13.4705M12 16.9999V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
