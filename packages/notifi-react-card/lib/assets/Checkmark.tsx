import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const Checkmark: React.FC<Props> = (props: Props) => {
  return (
    <svg
      {...props}
      width="15"
      height="11"
      viewBox="0 0 15 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.1426 6.37491C19.6259 6.86788 19.6181 7.65929 19.1251 8.14259L10.1213 16.9698L5.40797 12.6738C4.89775 12.2088 4.86113 11.4182 5.32617 10.908C5.79122 10.3977 6.58183 10.3611 7.09205 10.8262L10.0587 13.5302L17.3749 6.35741C17.8679 5.87411 18.6593 5.88195 19.1426 6.37491Z"
        fill="#EA7E68"
      />
    </svg>
  );
};
