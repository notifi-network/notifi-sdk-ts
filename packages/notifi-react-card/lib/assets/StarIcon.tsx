import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const StarIcon: React.FC<Props> = (props: Props) => {
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
        d="M12 5L13.5716 9.83688H18.6574L14.5429 12.8262L16.1145 17.6631L12 14.6738L7.8855 17.6631L9.4571 12.8262L5.3426 9.83688H10.4284L12 5Z"
        fill="currentColor"
      />
    </svg>
  );
};
