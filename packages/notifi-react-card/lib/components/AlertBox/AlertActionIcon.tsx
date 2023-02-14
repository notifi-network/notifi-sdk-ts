import React from 'react';

export type AlertActionIconProps = Readonly<{
  name?: string;
  className?: string;
}>;

const AlertActionIcon: React.FC<AlertActionIconProps> = ({
  name,
  className,
}) => {
  let view = null;

  switch (name) {
    case 'back':
      view = (
        <svg
          className={className}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5L5 12M5 12L12 19M5 12L19 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
      break;
    case 'close':
      view = (
        <svg
          className={className}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z"
            fill="currentColor"
          />
        </svg>
      );
      break;

    default:
      view = (
        <svg
          className={className}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.3632 11.6035C15.8054 11.7623 15.2166 11.8473 14.6079 11.8473C11.0752 11.8473 8.21136 8.98352 8.21136 5.45081C8.21136 4.82042 8.30255 4.21131 8.47246 3.63599H1.84458C0.825847 3.63599 0 4.46183 0 5.48057V18.1546C0 19.1733 0.825847 19.9992 1.84458 19.9992H14.5186C15.5374 19.9992 16.3632 19.1733 16.3632 18.1546V11.6035Z"
            fill="currentColor"
          />
          <path
            d="M19.9999 4.54534C19.9999 7.05566 17.9648 9.09067 15.4545 9.09067C12.9442 9.09067 10.9092 7.05566 10.9092 4.54534C10.9092 2.03502 12.9442 0 15.4545 0C17.9648 0 19.9999 2.03502 19.9999 4.54534Z"
            fill="url(#paint0_linear_872_5655)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_872_5655"
              x1="18.1994"
              y1="0.708364"
              x2="13.8312"
              y2="9.09067"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FE7970" />
              <stop offset="1" stop-color="#FEB776" />
            </linearGradient>
          </defs>
        </svg>
      );
      break;
  }

  return <>{view}</>;
};

export default AlertActionIcon;
