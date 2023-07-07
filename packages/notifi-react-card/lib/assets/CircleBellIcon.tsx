import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const CircleBellIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="9.5"
        fill="white"
        stroke="url(#paint0_linear_1316_3580)"
        stroke-width="2"
      />
      <path
        d="M10.4901 16.1875C11.1212 16.1875 11.6376 15.6712 11.6376 15.0401H9.3427C9.3427 15.6712 9.85331 16.1875 10.4901 16.1875ZM13.9324 12.7452V9.8766C13.9324 8.11529 12.9915 6.64083 11.3507 6.25071V5.86058C11.3507 5.38439 10.9663 5 10.4901 5C10.0139 5 9.62956 5.38439 9.62956 5.86058V6.25071C7.98299 6.64083 7.04783 8.10955 7.04783 9.8766V12.7452L5.90039 13.8926V14.4663H15.0799V13.8926L13.9324 12.7452Z"
        fill="#262949"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1316_3580"
          x1="15.6331"
          y1="3.32468"
          x2="7.46429"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FE7970" />
          <stop offset="1" stop-color="#FEB776" />
        </linearGradient>
      </defs>
    </svg>
  );
};
