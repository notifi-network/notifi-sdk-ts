import React from 'react';

export type Props = Readonly<{
  className?: string;
}>;

export const SmsIcon: React.FC<Props> = ({ className }: Props) => {
  return (
    <svg
      width="11"
      height="17"
      viewBox="0 0 11 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.33335 0.708328H2.66669C1.49085 0.708328 0.541687 1.65749 0.541687 2.83333V14.1667C0.541687 15.3425 1.49085 16.2917 2.66669 16.2917H8.33335C9.50919 16.2917 10.4584 15.3425 10.4584 14.1667V2.83333C10.4584 1.65749 9.50919 0.708328 8.33335 0.708328ZM6.91669 14.875H4.08335V14.1667H6.91669V14.875ZM9.21877 12.75H1.78127V2.83333H9.21877V12.75Z"
        fill="#B6B8D5"
      />
    </svg>
  );
};
