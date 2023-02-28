import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const EventCheckmarkIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 5L4 8.5L11.5 1" stroke="currentColor" stroke-width="2" />
    </svg>
  );
};
