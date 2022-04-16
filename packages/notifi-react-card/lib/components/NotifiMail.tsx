import React from 'react';

type Props = Readonly<{
  className?: string;
}>;

export const NotifiMail: React.FC<Props> = ({ className }: Props) => {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.332 2.66797H2.66536C1.93203 2.66797 1.3387 3.26797 1.3387 4.0013L1.33203 12.0013C1.33203 12.7346 1.93203 13.3346 2.66536 13.3346H13.332C14.0654 13.3346 14.6654 12.7346 14.6654 12.0013V4.0013C14.6654 3.26797 14.0654 2.66797 13.332 2.66797ZM13.332 5.33464L7.9987 8.66797L2.66536 5.33464V4.0013L7.9987 7.33464L13.332 4.0013V5.33464Z"
        fill="#B6B8D5"
      />
    </svg>
  );
};
