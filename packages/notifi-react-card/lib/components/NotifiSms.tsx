import React from 'react';

type Props = Readonly<{
  className?: string;
}>;

export const NotifiSms: React.FC<Props> = ({ className }: Props) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.6654 0.667969H5.33203C4.22536 0.667969 3.33203 1.5613 3.33203 2.66797V13.3346C3.33203 14.4413 4.22536 15.3346 5.33203 15.3346H10.6654C11.772 15.3346 12.6654 14.4413 12.6654 13.3346V2.66797C12.6654 1.5613 11.772 0.667969 10.6654 0.667969ZM9.33203 14.0013H6.66536V13.3346H9.33203V14.0013ZM11.4987 12.0013H4.4987V2.66797H11.4987V12.0013Z"
        fill="#B6B8D5"
      />
    </svg>
  );
};
