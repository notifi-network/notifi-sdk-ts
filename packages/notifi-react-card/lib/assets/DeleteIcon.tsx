import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const DeleteIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="inherit"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 17.4444C7.5 18.3 8.175 19 9 19H15C15.825 19 16.5 18.3 16.5 17.4444V8.11111H7.5V17.4444ZM17.25 5.77778H14.625L13.875 5H10.125L9.375 5.77778H6.75V7.33333H17.25V5.77778Z"
        fill="#inherit"
      />
    </svg>
  );
};
