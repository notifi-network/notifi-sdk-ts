import React from 'react';

export type Props = Readonly<{
  className?: string;
}>;

export const SettingIcon: React.FC<Props> = ({ className }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_136_523)">
        <path
          d="M3 17V19H9V17H3ZM3 5V7H13V5H3ZM13 21V19H21V17H13V15H11V21H13ZM7 9V11H3V13H7V15H9V9H7ZM21 13V11H11V13H21ZM15 9H17V7H21V5H17V3H15V9Z"
          fill="#80829D"
        />
      </g>
      <defs>
        <clipPath id="clip0_136_523">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
