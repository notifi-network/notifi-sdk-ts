import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const ClockIcon: React.FC<Props> = (props: Props) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12.75 8C12.75 7.58579 12.4142 7.25 12 7.25C11.5858 7.25 11.25 7.58579 11.25 8V12.5V12.8107L11.4697 13.0303L13.9697 15.5303C14.2626 15.8232 14.7374 15.8232 15.0303 15.5303C15.3232 15.2374 15.3232 14.7626 15.0303 14.4697L12.75 12.1893V8Z"
        fill="currentColor"
      />
    </svg>
  );
};
