import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const NotifiLogo: React.FC<Props> = (props: Props) => {
  return (
    <svg
      {...props}
      width="39"
      height="9"
      viewBox="0 0 39 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.92661 5.02549C7.68505 5.09427 7.43002 5.1311 7.16639 5.1311C5.63641 5.1311 4.39611 3.8908 4.39611 2.36082C4.39611 2.0878 4.43561 1.824 4.50919 1.57483H1.63872C1.19751 1.57483 0.839844 1.9325 0.839844 2.3737V7.86272C0.839844 8.30393 1.19751 8.66159 1.63872 8.66159H7.12774C7.56894 8.66159 7.92661 8.30393 7.92661 7.86272V5.02549Z"
        fill="white"
        className="notifiLogo-letters"
      />
      <path
        d="M9.5013 1.96855C9.5013 3.05574 8.61995 3.93709 7.53275 3.93709C6.44556 3.93709 5.56421 3.05574 5.56421 1.96855C5.56421 0.881348 6.44556 0 7.53275 0C8.61995 0 9.5013 0.881348 9.5013 1.96855Z"
        fill="url(#paint0_linear_872_5572)"
      />
      <path
        d="M17.9031 5.61338V8.60198H19.1442V5.61338C19.1442 3.77653 18.1911 2.57513 16.6819 2.57513C15.9471 2.57513 15.2918 3.012 15.0734 3.61766V2.64463H13.8323V8.60198H15.0734V5.6233C15.0734 4.57084 15.6592 3.81624 16.4634 3.81624C17.3372 3.81624 17.9031 4.52119 17.9031 5.61338Z"
        fill="black"
        className="notifiLogo-letters"
      />
      <path
        d="M19.9738 5.61338C19.9738 7.34101 21.2546 8.66155 22.9028 8.66155C24.551 8.66155 25.8219 7.34101 25.8219 5.61338C25.8219 3.89567 24.551 2.57513 22.9028 2.57513C21.2546 2.57513 19.9738 3.89567 19.9738 5.61338ZM22.9028 3.81624C23.856 3.81624 24.5808 4.5907 24.5808 5.61338C24.5808 6.64598 23.856 7.42044 22.9028 7.42044C21.9496 7.42044 21.2149 6.64598 21.2149 5.61338C21.2149 4.5907 21.9496 3.81624 22.9028 3.81624Z"
        fill="black"
        className="notifiLogo-letters"
      />
      <path
        d="M27.5834 1.38365L27.2855 2.64463H26.4019V3.81624H27.2855V6.55662C27.2855 8.01617 27.8813 8.60198 29.3011 8.60198H29.8174V7.37079H29.4203C28.8047 7.37079 28.5267 7.10271 28.5267 6.48712V3.81624H29.8174V2.64463H28.5267V1.38365H27.5834Z"
        fill="black"
        className="notifiLogo-letters"
      />
      <path
        d="M31.9217 8.60198V2.64463H30.6806V8.60198H31.9217Z"
        fill="black"
        className="notifiLogo-letters"
      />
      <path
        d="M38.2799 8.60198V2.64463H34.8644V2.20776C34.8644 1.59217 35.1424 1.31415 35.758 1.31415H36.1551V0.0928955H35.6388C34.219 0.0928955 33.6233 0.668778 33.6233 2.13826V2.64463H32.7495V3.81624H33.6233V8.60198H34.8644V3.81624H37.0388V8.60198H38.2799Z"
        fill="black"
        className="notifiLogo-letters"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.1573 0C30.8066 0 30.6804 0.192486 30.6804 0.466236V1.46139H31.6535C31.9914 1.46139 32.1418 1.34309 32.1418 1.00946V0.466236C32.1418 0.15399 31.9358 0 31.6193 0H31.1573Z"
        fill="black"
        className="notifiLogo-letters"
      />
      <defs>
        <linearGradient
          id="paint0_linear_872_5572"
          x1="8.72155"
          y1="0.306786"
          x2="6.8297"
          y2="3.93709"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FE7970" />
          <stop offset="1" stopColor="#FEB776" />
        </linearGradient>
      </defs>
    </svg>
  );
};
