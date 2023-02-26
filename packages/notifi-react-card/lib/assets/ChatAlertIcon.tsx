import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const ChatAlertIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#chat_alert_icon_clip0_13256_1794)">
        <path
          d="M18.332 1.83203H3.66536C2.65703 1.83203 1.83203 2.65703 1.83203 3.66536V20.1654L5.4987 16.4987H18.332C19.3404 16.4987 20.1654 15.6737 20.1654 14.6654V3.66536C20.1654 2.65703 19.3404 1.83203 18.332 1.83203ZM18.332 14.6654H5.4987L3.66536 16.4987V3.66536H18.332V14.6654Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="chat_alert_icon_clip0_13256_1794">
          <rect width="22" height="22" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};
