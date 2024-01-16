import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const NavbarIconBellEnabled: React.FC<Props> = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.94394 8.04573C4.94394 4.14875 8.10307 0.989624 12.0001 0.989624C15.897 0.989624 19.0562 4.14875 19.0562 8.04573V10.9069C19.1218 11.5485 19.302 12.1743 19.5892 12.7544L21.2968 16.2032C21.8895 17.4004 21.0185 18.8037 19.6826 18.8037H12.0336L12.0001 18.8038L11.9665 18.8037H4.31768C2.98176 18.8037 2.11072 17.4004 2.70348 16.2032L4.38294 12.8112C4.74815 12.0736 4.93998 11.2624 4.94394 10.4395V8.04573ZM11.9976 23.9996C10.165 23.9996 8.64883 22.8374 8.39664 21.3257H15.5986C15.3464 22.8374 13.8302 23.9996 11.9976 23.9996ZM8.35979 20.88L8.35984 20.8643V20.8956L8.35979 20.88Z"
        fill="currentColor"
      />
    </svg>
  );
};
