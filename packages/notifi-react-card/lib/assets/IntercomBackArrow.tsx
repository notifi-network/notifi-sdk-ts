import React from 'react';

export type Props = Readonly<{
  className?: string;
}>;

export const IntercomBackArrow: React.FC<Props> = ({ className }: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z"
        fill="#80829D"
      />
    </svg>
  );
};
