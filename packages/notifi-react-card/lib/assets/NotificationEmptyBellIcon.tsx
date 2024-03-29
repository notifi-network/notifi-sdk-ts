import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const NotificationEmptyBellIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      {...props}
      width="25"
      height="30"
      viewBox="0 0 25 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.2179 29.7812C13.8979 29.7812 15.2724 28.4067 15.2724 26.7268H9.16346C9.16346 28.4067 10.5227 29.7812 12.2179 29.7812ZM21.3814 20.6178V12.9816C21.3814 8.29293 18.8767 4.36792 14.5088 3.32939V2.29087C14.5088 1.02325 13.4856 0 12.2179 0C10.9503 0 9.92708 1.02325 9.92708 2.29087V3.32939C5.54389 4.36792 3.05449 8.27766 3.05449 12.9816V20.6178L0 23.6723V25.1995H24.4359V23.6723L21.3814 20.6178Z"
        fill="#F5F6FB"
      />
    </svg>
  );
};
