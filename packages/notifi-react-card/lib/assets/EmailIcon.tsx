import React from 'react';

export type Props = Readonly<{
  className?: string;
}>;

export const EmailIcon: React.FC<Props> = ({ className }: Props) => {
  return (
    <svg
      width="13"
      height="11"
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.5 0.499996H1.5C0.8125 0.499996 0.25625 1.0625 0.25625 1.75L0.25 9.25C0.25 9.9375 0.8125 10.5 1.5 10.5H11.5C12.1875 10.5 12.75 9.9375 12.75 9.25V1.75C12.75 1.0625 12.1875 0.499996 11.5 0.499996ZM11.5 3L6.5 6.125L1.5 3V1.75L6.5 4.875L11.5 1.75V3Z"
        fill="#B6B8D5"
      />
    </svg>
  );
};
