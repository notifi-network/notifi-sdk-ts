import React from 'react';

export type Props = Readonly<{
  className?: string;
}>;

export const TelegramIcon: React.FC<Props> = ({ className }: Props) => {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.63846 15.4458L16.4253 0.189566L0.00576619 5.06668L3.35716 9.10781L12.9656 3.06713L5.27554 11.4143L8.63846 15.4458Z"
        fill="#B6B8D5"
      />
    </svg>
  );
};
