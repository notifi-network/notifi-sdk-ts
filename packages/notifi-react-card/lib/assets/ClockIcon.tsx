import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const ClockIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      height="17px"
      width="17px"
      version="1.1"
      id="clock_icon"
      viewBox="0 0 512 512"
      {...props}
    >
      <g>
        <g>
          <path d="M256,0C114.842,0,0,114.842,0,256s114.842,256,256,256s256-114.842,256-256S397.158,0,256,0z M374.821,283.546H256    c-15.148,0-27.429-12.283-27.429-27.429V137.295c0-15.148,12.281-27.429,27.429-27.429s27.429,12.281,27.429,27.429v91.394h91.392    c15.148,0,27.429,12.279,27.429,27.429C402.249,271.263,389.968,283.546,374.821,283.546z" />
        </g>
      </g>
    </svg>
  );
};
