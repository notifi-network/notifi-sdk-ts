import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const CloseIcon: React.FC<Props> = (props: Props) => {
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
        fillRule="evenodd"
        d="M6.71751 5.28249L5.3033 6.6967L10.6066 12L5.3033 17.3033L6.71751 18.7175L12.0208 13.4142L17.3241 18.7175L18.7383 17.3033L13.435 12L18.7383 6.6967L17.3241 5.28249L12.0208 10.5858L6.71751 5.28249Z"
        fill="currentColor"
      />
    </svg>
  );
};
