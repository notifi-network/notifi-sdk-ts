import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const PenIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.293 15.619L15.619 5.29299C16.009 4.90299 16.642 4.90299 17.032 5.29299L18.708 6.96899C19.098 7.35899 19.098 7.99199 18.708 8.38199L8.381 18.707C8.194 18.895 7.94 19 7.675 19H5V16.325C5 16.06 5.105 15.806 5.293 15.619V15.619Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 7.16003L16.84 10.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
