import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export type IconType =
  | 'connect'
  | 'check'
  | 'email'
  | 'sms'
  | 'telegram'
  | 'arrow-back';

export const Icon: React.FC<Props & { type: IconType }> = (
  props: Props & { type: IconType },
) => {
  switch (props.type) {
    case 'connect':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <g clip-path="url(#clip0_1821_6938)">
            <path
              d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_1821_6938">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case 'check':
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
            d="M6 12.5L9.84 16L18 8"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'email':
      return (
        <svg
          {...props}
          width="13"
          height="11"
          viewBox="0 0 13 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 0.499996H1.5C0.8125 0.499996 0.25625 1.0625 0.25625 1.75L0.25 9.25C0.25 9.9375 0.8125 10.5 1.5 10.5H11.5C12.1875 10.5 12.75 9.9375 12.75 9.25V1.75C12.75 1.0625 12.1875 0.499996 11.5 0.499996ZM11.5 3L6.5 6.125L1.5 3V1.75L6.5 4.875L11.5 1.75V3Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'sms':
      return (
        <svg
          {...props}
          width="11"
          height="17"
          viewBox="0 0 11 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.33335 0.708328H2.66669C1.49085 0.708328 0.541687 1.65749 0.541687 2.83333V14.1667C0.541687 15.3425 1.49085 16.2917 2.66669 16.2917H8.33335C9.50919 16.2917 10.4584 15.3425 10.4584 14.1667V2.83333C10.4584 1.65749 9.50919 0.708328 8.33335 0.708328ZM6.91669 14.875H4.08335V14.1667H6.91669V14.875ZM9.21877 12.75H1.78127V2.83333H9.21877V12.75Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'telegram':
      return (
        <svg
          {...props}
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.63846 15.4458L16.4253 0.189566L0.00576619 5.06668L3.35716 9.10781L12.9656 3.06713L5.27554 11.4143L8.63846 15.4458Z"
            fill="#B6B8D5"
          />
        </svg>
      );
    case 'arrow-back':
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
            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
};
