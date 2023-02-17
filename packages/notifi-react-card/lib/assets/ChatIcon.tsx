import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const ChatIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.15311 3.40909C3.15311 2.07859 4.2317 1 5.5622 1H17.0455C18.376 1 19.4545 2.07859 19.4545 3.40909V6.81818C19.4545 8.14869 18.376 9.22727 17.0455 9.22727H4.96513C4.60464 9.22727 4.2455 9.27148 3.89577 9.35892L2.08876 9.81067C2.04981 9.82041 2.02716 9.81574 2.01212 9.8104C1.99287 9.80356 1.97002 9.78898 1.95023 9.76483C1.93043 9.74069 1.92062 9.71542 1.91769 9.6952C1.9154 9.67941 1.91526 9.65628 1.93245 9.62L2.72868 7.93906C3.00814 7.34909 3.15311 6.70441 3.15311 6.05159V3.40909Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20.9831 16.0454C20.9831 14.7149 19.9045 13.6364 18.574 13.6364H7.09077C5.76027 13.6364 4.68168 14.7149 4.68168 16.0454V19.4545C4.68168 20.785 5.76027 21.8636 7.09078 21.8636H19.1711C19.5316 21.8636 19.8907 21.9078 20.2405 21.9953L22.0475 22.447C22.0864 22.4568 22.1091 22.4521 22.1241 22.4467C22.1434 22.4399 22.1662 22.4253 22.186 22.4012C22.2058 22.377 22.2156 22.3518 22.2185 22.3316C22.2208 22.3158 22.221 22.2926 22.2038 22.2564L21.4075 20.5754C21.1281 19.9854 20.9831 19.3408 20.9831 18.6879V16.0454Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <mask id="path-3-inside-1_136_525" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.6362 17.75C11.6362 18.3776 12.1449 18.8864 12.7725 18.8864C13.4001 18.8864 13.9089 18.3776 13.9089 17.75C13.9089 17.1224 13.4001 16.6136 12.7725 16.6136C12.1449 16.6136 11.6362 17.1224 11.6362 17.75ZM16.1816 17.75C16.1816 18.3776 16.6904 18.8864 17.318 18.8864C17.9456 18.8864 18.4543 18.3776 18.4543 17.75C18.4543 17.1224 17.9456 16.6137 17.318 16.6137C16.6904 16.6137 16.1816 17.1224 16.1816 17.75ZM8.22709 18.8864C7.59949 18.8864 7.09073 18.3776 7.09073 17.75C7.09073 17.1224 7.59949 16.6136 8.22709 16.6136C8.85469 16.6136 9.36345 17.1224 9.36345 17.75C9.36345 18.3776 8.85469 18.8864 8.22709 18.8864Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6362 17.75C11.6362 18.3776 12.1449 18.8864 12.7725 18.8864C13.4001 18.8864 13.9089 18.3776 13.9089 17.75C13.9089 17.1224 13.4001 16.6136 12.7725 16.6136C12.1449 16.6136 11.6362 17.1224 11.6362 17.75ZM16.1816 17.75C16.1816 18.3776 16.6904 18.8864 17.318 18.8864C17.9456 18.8864 18.4543 18.3776 18.4543 17.75C18.4543 17.1224 17.9456 16.6137 17.318 16.6137C16.6904 16.6137 16.1816 17.1224 16.1816 17.75ZM8.22709 18.8864C7.59949 18.8864 7.09073 18.3776 7.09073 17.75C7.09073 17.1224 7.59949 16.6136 8.22709 16.6136C8.85469 16.6136 9.36345 17.1224 9.36345 17.75C9.36345 18.3776 8.85469 18.8864 8.22709 18.8864Z"
        fill="currentColor"
      />
      <path
        d="M12.7725 20.8864C11.0404 20.8864 9.63618 19.4822 9.63618 17.75H13.6362C13.6362 17.273 13.2495 16.8864 12.7725 16.8864V20.8864ZM15.9089 17.75C15.9089 19.4822 14.5047 20.8864 12.7725 20.8864V16.8864C12.2956 16.8864 11.9089 17.273 11.9089 17.75H15.9089ZM12.7725 14.6136C14.5047 14.6136 15.9089 16.0178 15.9089 17.75H11.9089C11.9089 18.227 12.2956 18.6136 12.7725 18.6136V14.6136ZM9.63618 17.75C9.63618 16.0178 11.0404 14.6136 12.7725 14.6136V18.6136C13.2495 18.6136 13.6362 18.227 13.6362 17.75H9.63618ZM17.318 20.8864C15.5858 20.8864 14.1816 19.4822 14.1816 17.75H18.1816C18.1816 17.273 17.795 16.8864 17.318 16.8864V20.8864ZM20.4543 17.75C20.4543 19.4822 19.0501 20.8864 17.318 20.8864V16.8864C16.841 16.8864 16.4543 17.273 16.4543 17.75H20.4543ZM17.318 14.6137C19.0501 14.6137 20.4543 16.0178 20.4543 17.75H16.4543C16.4543 18.227 16.841 18.6137 17.318 18.6137V14.6137ZM14.1816 17.75C14.1816 16.0178 15.5858 14.6137 17.318 14.6137V18.6137C17.795 18.6137 18.1816 18.227 18.1816 17.75H14.1816ZM9.09073 17.75C9.09073 17.273 8.70406 16.8864 8.22709 16.8864V20.8864C6.49492 20.8864 5.09073 19.4822 5.09073 17.75H9.09073ZM8.22709 18.6136C8.70406 18.6136 9.09073 18.227 9.09073 17.75H5.09073C5.09073 16.0178 6.49492 14.6136 8.22709 14.6136V18.6136ZM7.36345 17.75C7.36345 18.227 7.75012 18.6136 8.22709 18.6136V14.6136C9.95926 14.6136 11.3635 16.0178 11.3635 17.75H7.36345ZM8.22709 16.8864C7.75012 16.8864 7.36345 17.273 7.36345 17.75H11.3635C11.3635 19.4822 9.95926 20.8864 8.22709 20.8864V16.8864Z"
        fill="currentColor"
        mask="url(#path-3-inside-1_136_525)"
      />
    </svg>
  );
};
