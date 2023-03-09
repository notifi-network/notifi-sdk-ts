import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const UrgentIcon: React.FC<Props> = (props: Props) => {
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM11.25 9.25C11.25 8.83579 11.5858 8.5 12 8.5C12.4142 8.5 12.75 8.83579 12.75 9.25V13.25C12.75 13.6642 12.4142 14 12 14C11.5858 14 11.25 13.6642 11.25 13.25V9.25ZM11.25 15.25C11.25 14.8358 11.5858 14.5 12 14.5C12.4142 14.5 12.75 14.8358 12.75 15.25C12.75 15.6642 12.4142 16 12 16C11.5858 16 11.25 15.6642 11.25 15.25Z"
        fill="currentColor"
      />
    </svg>
  );
};
