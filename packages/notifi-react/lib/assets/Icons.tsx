import { Types } from '@notifi-network/notifi-graphql';
import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export type IconType =
  | Types.GenericEventIconHint
  | 'connect'
  | 'check'
  | 'email'
  | 'sms'
  | 'telegram'
  | 'arrow-back'
  | 'discord'
  | 'slack'
  | 'info'
  | 'bin'
  | 'gear'
  | 'gear-fill'
  | 'bell'
  | 'bell-fill'
  | 'empty-box';

export const Icon: React.FC<Props & { type: IconType }> = (
  props: Props & { type: IconType },
) => {
  switch (props.type) {
    case 'connect':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <g clipPath="url(#clip0_1821_6938)">
            <path
              d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_1821_6938">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case 'check':
      return (
        <svg
          {...props}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12.5L9.84 16L18 8"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'email':
      return (
        <svg
          {...props}
          width="13"
          height="11"
          viewBox="0 0 13 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 0.499996H1.5C0.8125 0.499996 0.25625 1.0625 0.25625 1.75L0.25 9.25C0.25 9.9375 0.8125 10.5 1.5 10.5H11.5C12.1875 10.5 12.75 9.9375 12.75 9.25V1.75C12.75 1.0625 12.1875 0.499996 11.5 0.499996ZM11.5 3L6.5 6.125L1.5 3V1.75L6.5 4.875L11.5 1.75V3Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'sms':
      return (
        <svg
          {...props}
          width="11"
          height="17"
          viewBox="0 0 11 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.33335 0.708328H2.66669C1.49085 0.708328 0.541687 1.65749 0.541687 2.83333V14.1667C0.541687 15.3425 1.49085 16.2917 2.66669 16.2917H8.33335C9.50919 16.2917 10.4584 15.3425 10.4584 14.1667V2.83333C10.4584 1.65749 9.50919 0.708328 8.33335 0.708328ZM6.91669 14.875H4.08335V14.1667H6.91669V14.875ZM9.21877 12.75H1.78127V2.83333H9.21877V12.75Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'telegram':
      return (
        <svg
          {...props}
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.63846 15.4458L16.4253 0.189566L0.00576619 5.06668L3.35716 9.10781L12.9656 3.06713L5.27554 11.4143L8.63846 15.4458Z"
            fill="#B6B8D5"
          />
        </svg>
      );
    case 'arrow-back':
      return (
        <svg
          {...props}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'discord':
      return (
        <svg
          {...props}
          width="17"
          height="13"
          viewBox="0 0 17 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.0728 1.05036C13.0133 0.564196 11.8771 0.206009 10.6891 0.000860571C10.6675 -0.00309873 10.6459 0.00679578 10.6347 0.0265853C10.4886 0.286483 10.3267 0.62554 10.2134 0.892038C8.93563 0.700746 7.66444 0.700746 6.4129 0.892038C6.29953 0.619617 6.13179 0.286483 5.98501 0.0265853C5.97386 0.00745605 5.95225 -0.00243846 5.93062 0.000860571C4.74329 0.205353 3.60709 0.56354 2.54688 1.05036C2.5377 1.05432 2.52983 1.06092 2.52461 1.06949C0.369461 4.28924 -0.220925 7.42985 0.0686984 10.5315C0.0700089 10.5467 0.0785271 10.5612 0.0903219 10.5704C1.51223 11.6146 2.88959 12.2486 4.24137 12.6688C4.263 12.6754 4.28593 12.6675 4.29969 12.6496C4.61946 12.213 4.9045 11.7525 5.14889 11.2683C5.16332 11.24 5.14955 11.2063 5.12007 11.1951C4.66795 11.0236 4.23744 10.8145 3.82331 10.577C3.79056 10.5579 3.78793 10.5111 3.81807 10.4886C3.90522 10.4233 3.99239 10.3554 4.0756 10.2868C4.09065 10.2742 4.11163 10.2716 4.12933 10.2795C6.84994 11.5217 9.79533 11.5217 12.4838 10.2795C12.5015 10.2709 12.5225 10.2736 12.5382 10.2861C12.6215 10.3547 12.7086 10.4233 12.7964 10.4886C12.8265 10.5111 12.8246 10.5579 12.7918 10.577C12.3777 10.8191 11.9472 11.0236 11.4944 11.1945C11.4649 11.2057 11.4518 11.24 11.4662 11.2683C11.7159 11.7519 12.0009 12.2123 12.3148 12.649C12.3279 12.6675 12.3515 12.6754 12.3731 12.6688C13.7314 12.2486 15.1088 11.6146 16.5307 10.5704C16.5432 10.5612 16.551 10.5473 16.5523 10.5322C16.899 6.9463 15.9718 3.83145 14.0945 1.07015C14.0899 1.06092 14.082 1.05432 14.0728 1.05036ZM5.55517 8.64293C4.73608 8.64293 4.06118 7.89094 4.06118 6.96742C4.06118 6.04391 4.72299 5.29192 5.55517 5.29192C6.39389 5.29192 7.06226 6.05051 7.04915 6.96742C7.04915 7.89094 6.38733 8.64293 5.55517 8.64293ZM11.079 8.64293C10.2599 8.64293 9.585 7.89094 9.585 6.96742C9.585 6.04391 10.2468 5.29192 11.079 5.29192C11.9177 5.29192 12.5861 6.05051 12.573 6.96742C12.573 7.89094 11.9177 8.64293 11.079 8.64293Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'slack':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3.94125 9.84688C3.941 10.1377 3.85454 10.4219 3.6928 10.6636C3.53105 10.9052 3.30129 11.0935 3.03254 11.2047C2.7638 11.3158 2.46815 11.3447 2.18295 11.2878C1.89776 11.231 1.63584 11.0908 1.4303 10.8851C1.22475 10.6794 1.08481 10.4173 1.02817 10.1321C0.971524 9.84683 1.00072 9.5512 1.11206 9.28255C1.22341 9.0139 1.4119 8.7843 1.65372 8.62276C1.89554 8.46122 2.17982 8.375 2.47063 8.375H3.94125V9.84688Z"
            fill="currentColor"
          />
          <path
            d="M4.68262 9.84709C4.68262 9.45706 4.83756 9.083 5.11335 8.8072C5.38915 8.5314 5.76321 8.37646 6.15324 8.37646C6.54328 8.37646 6.91734 8.5314 7.19313 8.8072C7.46893 9.083 7.62387 9.45706 7.62387 9.84709V13.5296C7.62387 13.9196 7.46893 14.2937 7.19313 14.5695C6.91734 14.8453 6.54328 15.0002 6.15324 15.0002C5.76321 15.0002 5.38915 14.8453 5.11335 14.5695C4.83756 14.2937 4.68262 13.9196 4.68262 13.5296V9.84709Z"
            fill="currentColor"
          />
          <path
            d="M6.15297 3.94125C5.86216 3.941 5.57795 3.85454 5.33628 3.6928C5.0946 3.53105 4.9063 3.30129 4.79518 3.03254C4.68406 2.7638 4.65512 2.46815 4.712 2.18295C4.76889 1.89776 4.90905 1.63584 5.11477 1.4303C5.32049 1.22475 5.58254 1.08481 5.86777 1.02817C6.15301 0.971524 6.44864 1.00072 6.71729 1.11206C6.98594 1.22341 7.21555 1.4119 7.37709 1.65372C7.53863 1.89554 7.62484 2.17982 7.62484 2.47063V3.94125H6.15297Z"
            fill="currentColor"
          />
          <path
            d="M6.15312 4.68262C6.54316 4.68262 6.91722 4.83756 7.19301 5.11335C7.46881 5.38915 7.62375 5.76321 7.62375 6.15324C7.62375 6.54328 7.46881 6.91734 7.19301 7.19313C6.91722 7.46893 6.54316 7.62387 6.15312 7.62387H2.47062C2.08059 7.62387 1.70653 7.46893 1.43074 7.19313C1.15494 6.91734 1 6.54328 1 6.15324C1 5.76321 1.15494 5.38915 1.43074 5.11335C1.70653 4.83756 2.08059 4.68262 2.47062 4.68262H6.15312Z"
            fill="currentColor"
          />
          <path
            d="M12.0586 6.15297C12.0588 5.86216 12.1453 5.57795 12.307 5.33628C12.4688 5.0946 12.6986 4.9063 12.9673 4.79518C13.236 4.68406 13.5317 4.65512 13.8169 4.712C14.1021 4.76889 14.364 4.90905 14.5695 5.11477C14.7751 5.32049 14.915 5.58254 14.9717 5.86777C15.0283 6.15301 14.9991 6.44864 14.8878 6.71729C14.7764 6.98594 14.5879 7.21555 14.3461 7.37709C14.1043 7.53863 13.82 7.62484 13.5292 7.62484H12.0586V6.15297Z"
            fill="currentColor"
          />
          <path
            d="M11.3177 6.15312C11.3177 6.54316 11.1628 6.91722 10.887 7.19301C10.6112 7.46881 10.2371 7.62375 9.84709 7.62375C9.45706 7.62375 9.083 7.46881 8.8072 7.19301C8.5314 6.91722 8.37646 6.54316 8.37646 6.15312V2.47062C8.37646 2.08059 8.5314 1.70653 8.8072 1.43074C9.083 1.15494 9.45706 1 9.84709 1C10.2371 1 10.6112 1.15494 10.887 1.43074C11.1628 1.70653 11.3177 2.08059 11.3177 2.47062V6.15312Z"
            fill="currentColor"
          />
          <path
            d="M9.84688 12.0586C10.1377 12.0588 10.4219 12.1453 10.6636 12.307C10.9052 12.4688 11.0935 12.6986 11.2047 12.9673C11.3158 13.236 11.3447 13.5317 11.2878 13.8169C11.231 14.1021 11.0908 14.364 10.8851 14.5695C10.6794 14.7751 10.4173 14.915 10.1321 14.9717C9.84683 15.0283 9.5512 14.9991 9.28255 14.8878C9.0139 14.7764 8.7843 14.5879 8.62276 14.3461C8.46122 14.1043 8.375 13.82 8.375 13.5292V12.0586H9.84688Z"
            fill="currentColor"
          />
          <path
            d="M9.84709 11.3177C9.45706 11.3177 9.083 11.1628 8.8072 10.887C8.5314 10.6112 8.37646 10.2371 8.37646 9.84709C8.37646 9.45706 8.5314 9.083 8.8072 8.8072C9.083 8.5314 9.45706 8.37646 9.84709 8.37646H13.5296C13.9196 8.37646 14.2937 8.5314 14.5695 8.8072C14.8453 9.083 15.0002 9.45706 15.0002 9.84709C15.0002 10.2371 14.8453 10.6112 14.5695 10.887C14.2937 11.1628 13.9196 11.3177 13.5296 11.3177H9.84709Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'info':
      return (
        <svg
          {...props}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.3335 8.66671H12.6668V10H11.3335V8.66671ZM11.3335 11.3334H12.6668V15.3334H11.3335V11.3334ZM12.0002 5.33337C8.32016 5.33337 5.3335 8.32004 5.3335 12C5.3335 15.68 8.32016 18.6667 12.0002 18.6667C15.6802 18.6667 18.6668 15.68 18.6668 12C18.6668 8.32004 15.6802 5.33337 12.0002 5.33337ZM12.0002 17.3334C9.06016 17.3334 6.66683 14.94 6.66683 12C6.66683 9.06004 9.06016 6.66671 12.0002 6.66671C14.9402 6.66671 17.3335 9.06004 17.3335 12C17.3335 14.94 14.9402 17.3334 12.0002 17.3334Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'bin':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <g clipPath="url(#clip0_5611_1341)">
            <path
              d="M7.5 17.4444C7.5 18.3 8.175 19 9 19H15C15.825 19 16.5 18.3 16.5 17.4444V8.11111H7.5V17.4444ZM17.25 5.77778H14.625L13.875 5H10.125L9.375 5.77778H6.75V7.33333H17.25V5.77778Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_5611_1341">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case 'gear':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21.2938 13.9001L20.8498 13.6441C21.0497 12.5566 21.0497 11.4417 20.8498 10.3541L21.2938 10.0981C21.6352 9.90114 21.9345 9.63883 22.1746 9.32618C22.4147 9.01353 22.5908 8.65666 22.6929 8.27594C22.7951 7.89522 22.8212 7.49811 22.7699 7.10728C22.7186 6.71645 22.5908 6.33956 22.3938 5.99812C22.1968 5.65669 21.9345 5.35739 21.6219 5.11733C21.3092 4.87726 20.9523 4.70113 20.5716 4.59898C20.1909 4.49684 19.7938 4.47068 19.403 4.52201C19.0121 4.57334 18.6352 4.70114 18.2938 4.89812L17.8488 5.15512C17.0083 4.43704 16.0425 3.88037 14.9998 3.51312V3.00012C14.9998 2.20447 14.6837 1.44141 14.1211 0.878802C13.5585 0.316193 12.7954 0.00012207 11.9998 0.00012207C11.2041 0.00012207 10.4411 0.316193 9.87848 0.878802C9.31587 1.44141 8.9998 2.20447 8.9998 3.00012V3.51312C7.95719 3.88169 6.99165 4.43972 6.1518 5.15912L5.7048 4.90012C5.01524 4.5023 4.19588 4.39469 3.42698 4.60098C2.65808 4.80727 2.00262 5.31056 1.6048 6.00012C1.20697 6.68968 1.09937 7.50904 1.30566 8.27794C1.51195 9.04684 2.01524 9.7023 2.7048 10.1001L3.1488 10.3561C2.94891 11.4437 2.94891 12.5586 3.1488 13.6461L2.7048 13.9021C2.01524 14.2999 1.51195 14.9554 1.30566 15.7243C1.09937 16.4932 1.20697 17.3126 1.6048 18.0021C2.00262 18.6917 2.65808 19.195 3.42698 19.4013C4.19588 19.6075 5.01524 19.4999 5.7048 19.1021L6.1498 18.8451C6.99056 19.5633 7.95678 20.12 8.9998 20.4871V21.0001C8.9998 21.7958 9.31587 22.5588 9.87848 23.1214C10.4411 23.6841 11.2041 24.0001 11.9998 24.0001C12.7954 24.0001 13.5585 23.6841 14.1211 23.1214C14.6837 22.5588 14.9998 21.7958 14.9998 21.0001V20.4871C16.0424 20.1186 17.008 19.5605 17.8478 18.8411L18.2948 19.0991C18.9844 19.4969 19.8037 19.6045 20.5726 19.3983C21.3415 19.192 21.997 18.6887 22.3948 17.9991C22.7926 17.3096 22.9002 16.4902 22.6939 15.7213C22.4876 14.9524 21.9844 14.2969 21.2948 13.8991L21.2938 13.9001ZM18.7458 10.1241C19.0844 11.3512 19.0844 12.6471 18.7458 13.8741C18.6867 14.0877 18.7002 14.3149 18.7841 14.5199C18.8681 14.725 19.0178 14.8964 19.2098 15.0071L20.2938 15.6331C20.5236 15.7657 20.6913 15.9842 20.7601 16.2405C20.8288 16.4967 20.7929 16.7698 20.6603 16.9996C20.5277 17.2294 20.3092 17.3972 20.053 17.4659C19.7967 17.5346 19.5236 17.4987 19.2938 17.3661L18.2078 16.7381C18.0157 16.6269 17.792 16.5827 17.572 16.6126C17.3521 16.6424 17.1483 16.7447 16.9928 16.9031C16.1027 17.8118 14.9814 18.4601 13.7498 18.7781C13.5348 18.8334 13.3444 18.9586 13.2084 19.134C13.0724 19.3095 12.9987 19.5252 12.9988 19.7471V21.0001C12.9988 21.2653 12.8934 21.5197 12.7059 21.7072C12.5184 21.8948 12.264 22.0001 11.9988 22.0001C11.7336 22.0001 11.4792 21.8948 11.2917 21.7072C11.1042 21.5197 10.9988 21.2653 10.9988 21.0001V19.7481C10.9989 19.5262 10.9252 19.3105 10.7892 19.135C10.6532 18.9596 10.4628 18.8344 10.2478 18.7791C9.01615 18.4598 7.89513 17.8101 7.0058 16.9001C6.85032 16.7417 6.64654 16.6394 6.42655 16.6096C6.20657 16.5797 5.9829 16.6239 5.7908 16.7351L4.7068 17.3621C4.59303 17.4288 4.46719 17.4724 4.33652 17.4902C4.20586 17.5081 4.07295 17.4999 3.94545 17.4662C3.81795 17.4325 3.69838 17.3739 3.59362 17.2938C3.48886 17.2137 3.40098 17.1137 3.33504 16.9995C3.26909 16.8852 3.22639 16.7591 3.2094 16.6283C3.1924 16.4976 3.20144 16.3647 3.23599 16.2374C3.27054 16.1102 3.32993 15.991 3.41073 15.8867C3.49153 15.7825 3.59215 15.6953 3.7068 15.6301L4.7908 15.0041C4.98275 14.8934 5.13247 14.722 5.21646 14.5169C5.30044 14.3119 5.31393 14.0847 5.2548 13.8711C4.91616 12.6441 4.91616 11.3482 5.2548 10.1211C5.31286 9.908 5.29873 9.68166 5.21461 9.47741C5.13049 9.27317 4.98111 9.10253 4.7898 8.99212L3.7058 8.36612C3.47599 8.23351 3.30827 8.01505 3.23954 7.75878C3.17081 7.50251 3.20669 7.22943 3.3393 6.99962C3.47191 6.76981 3.69038 6.60209 3.94664 6.53336C4.20291 6.46463 4.47599 6.50051 4.7058 6.63312L5.7918 7.26112C5.98338 7.37264 6.20658 7.41733 6.42633 7.38819C6.64607 7.35905 6.84991 7.25772 7.0058 7.10012C7.89589 6.19147 9.01722 5.54314 10.2488 5.22512C10.4644 5.16969 10.6554 5.04387 10.7914 4.86762C10.9275 4.69137 11.0008 4.47476 10.9998 4.25212V3.00012C10.9998 2.73491 11.1052 2.48055 11.2927 2.29302C11.4802 2.10548 11.7346 2.00012 11.9998 2.00012C12.265 2.00012 12.5194 2.10548 12.7069 2.29302C12.8944 2.48055 12.9998 2.73491 12.9998 3.00012V4.25212C12.9997 4.47408 13.0734 4.68977 13.2094 4.8652C13.3454 5.04064 13.5358 5.16585 13.7508 5.22112C14.9828 5.54027 16.1042 6.19001 16.9938 7.10012C17.1493 7.25859 17.3531 7.36081 17.573 7.39069C17.793 7.42056 18.0167 7.37639 18.2088 7.26512L19.2928 6.63812C19.4066 6.57142 19.5324 6.52789 19.6631 6.51002C19.7937 6.49216 19.9266 6.50031 20.0541 6.53402C20.1816 6.56773 20.3012 6.62633 20.406 6.70644C20.5107 6.78654 20.5986 6.88658 20.6646 7.00079C20.7305 7.11501 20.7732 7.24113 20.7902 7.37191C20.8072 7.50269 20.7982 7.63554 20.7636 7.76281C20.7291 7.89009 20.6697 8.00927 20.5889 8.1135C20.5081 8.21772 20.4074 8.30494 20.2928 8.37012L19.2088 8.99612C19.0178 9.10683 18.8689 9.2776 18.7851 9.48182C18.7014 9.68603 18.6876 9.91222 18.7458 10.1251V10.1241Z"
            fill="currentColor"
          />
          <path
            d="M12 8.00073C11.2089 8.00073 10.4355 8.23533 9.77772 8.67485C9.11993 9.11438 8.60723 9.73909 8.30448 10.47C8.00173 11.2009 7.92252 12.0052 8.07686 12.7811C8.2312 13.557 8.61216 14.2697 9.17157 14.8292C9.73098 15.3886 10.4437 15.7695 11.2196 15.9239C11.9956 16.0782 12.7998 15.999 13.5307 15.6963C14.2616 15.3935 14.8864 14.8808 15.3259 14.223C15.7654 13.5652 16 12.7919 16 12.0007C16 10.9399 15.5786 9.92245 14.8284 9.17231C14.0783 8.42216 13.0609 8.00073 12 8.00073ZM12 14.0007C11.6044 14.0007 11.2178 13.8834 10.8889 13.6637C10.56 13.4439 10.3036 13.1316 10.1522 12.7661C10.0009 12.4006 9.96126 11.9985 10.0384 11.6106C10.1156 11.2226 10.3061 10.8662 10.5858 10.5865C10.8655 10.3068 11.2219 10.1163 11.6098 10.0392C11.9978 9.96199 12.3999 10.0016 12.7654 10.153C13.1308 10.3043 13.4432 10.5607 13.6629 10.8896C13.8827 11.2185 14 11.6052 14 12.0007C14 12.5312 13.7893 13.0399 13.4142 13.4149C13.0391 13.79 12.5304 14.0007 12 14.0007Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'gear-fill':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
        >
          <path
            d="M0.606821 18C1.43398 19.4356 3.26834 19.9288 4.70393 19.1017C4.70491 19.1011 4.70585 19.1005 4.70684 19.1L5.15182 18.843C5.99182 19.5616 6.95735 20.119 7.9998 20.487V21C7.9998 22.6568 9.34296 24 10.9998 24C12.6566 24 13.9998 22.6568 13.9998 21V20.487C15.0424 20.1184 16.008 19.5604 16.8478 18.841L17.2948 19.099C18.7307 19.9274 20.5664 19.4349 21.3948 17.999C22.2232 16.563 21.7308 14.7274 20.2948 13.899L19.8508 13.643C20.0507 12.5554 20.0507 11.4405 19.8508 10.353L20.2948 10.097C21.7307 9.26855 22.2232 7.43292 21.3948 5.99695C20.5664 4.56103 18.7308 4.06852 17.2948 4.89694L16.8498 5.15395C16.009 4.43616 15.0428 3.87984 13.9998 3.513V3C13.9998 1.34316 12.6566 0 10.9998 0C9.34296 0 7.9998 1.34316 7.9998 3V3.513C6.95721 3.88158 5.99163 4.43958 5.15182 5.15902L4.70482 4.90003C3.26885 4.07156 1.43323 4.56408 0.604805 6C-0.223617 7.43592 0.268852 9.27159 1.70482 10.1L2.14882 10.356C1.94895 11.4435 1.94895 12.5584 2.14882 13.646L1.70482 13.902C0.272836 14.7326 -0.218039 16.5647 0.606821 18ZM10.9998 8.00002C13.2089 8.00002 14.9998 9.79088 14.9998 12C14.9998 14.2091 13.2089 16 10.9998 16C8.79068 16 6.99982 14.2091 6.99982 12C6.99982 9.79088 8.79068 8.00002 10.9998 8.00002Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'bell':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.94375 9.04573C5.94375 5.70104 8.65517 2.98962 11.9999 2.98962C15.3446 2.98962 18.056 5.70104 18.056 9.04573V11.9069V11.9579L18.0612 12.0087C18.139 12.769 18.3525 13.5107 18.6928 14.1981L20.4004 17.6469C20.6641 18.1795 20.2766 18.8037 19.6824 18.8037L12.0334 18.8037L12.0288 18.8037L11.9999 18.8038L11.9709 18.8037H11.9663H4.3175C3.72325 18.8037 3.33579 18.1795 3.59946 17.6469L5.27892 14.2549C5.71172 13.3808 5.93905 12.4195 5.94374 11.4443H5.94375V11.4395V9.04573ZM11.9999 0.989624C7.5506 0.989624 3.94375 4.59646 3.94375 9.04573V11.437C3.94019 12.1068 3.78387 12.7671 3.48658 13.3675L1.80712 16.7595C0.88527 18.6214 2.2399 20.8037 4.3175 20.8037H11.9663L11.9999 20.8038L12.0334 20.8037H19.6824C21.76 20.8037 23.1146 18.6214 22.1927 16.7595L20.4851 13.3107C20.2583 12.8525 20.1134 12.3592 20.056 11.8532V9.04573C20.056 4.59647 16.4491 0.989624 11.9999 0.989624ZM11.9974 24.9996C10.1648 24.9996 8.64864 23.8374 8.39645 22.3257H15.5984C15.3462 23.8374 13.8301 24.9996 11.9974 24.9996ZM11.9974 18.7604L11.9796 18.7604H12.0153L11.9974 18.7604ZM8.35961 21.88L8.35965 21.8643V21.8956L8.35961 21.88Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'bell-fill':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.94394 8.04573C4.94394 4.14875 8.10307 0.989624 12.0001 0.989624C15.897 0.989624 19.0562 4.14875 19.0562 8.04573V10.9069C19.1218 11.5485 19.302 12.1743 19.5892 12.7544L21.2968 16.2032C21.8895 17.4004 21.0185 18.8037 19.6826 18.8037H12.0336L12.0001 18.8038L11.9665 18.8037H4.31768C2.98176 18.8037 2.11072 17.4004 2.70348 16.2032L4.38294 12.8112C4.74815 12.0736 4.93998 11.2624 4.94394 10.4395V8.04573ZM11.9976 23.9996C10.165 23.9996 8.64883 22.8374 8.39664 21.3257H15.5986C15.3464 22.8374 13.8302 23.9996 11.9976 23.9996ZM8.35979 20.88L8.35984 20.8643V20.8956L8.35979 20.88Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'CHART':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M17.0556 5.5H6.94444C6.15 5.5 5.5 6.15 5.5 6.94444V17.0556C5.5 17.85 6.15 18.5 6.94444 18.5H17.0556C17.85 18.5 18.5 17.85 18.5 17.0556V6.94444C18.5 6.15 17.85 5.5 17.0556 5.5ZM9.83333 15.6111H8.38889V10.5556H9.83333V15.6111ZM12.7222 15.6111H11.2778V8.38889H12.7222V15.6111ZM15.6111 15.6111H14.1667V12.7222H15.6111V15.6111Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'CHECKMARK':
      return (
        <svg
          {...props}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12.5L9.84 16L18 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'CLOCK':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12.75 8C12.75 7.58579 12.4142 7.25 12 7.25C11.5858 7.25 11.25 7.58579 11.25 8V12.5V12.8107L11.4697 13.0303L13.9697 15.5303C14.2626 15.8232 14.7374 15.8232 15.0303 15.5303C15.3232 15.2374 15.3232 14.7626 15.0303 14.4697L12.75 12.1893V8Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'DAO':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.0623 7.92265L12.0002 5L6.93799 7.92265L12.0002 10.8453L17.0623 7.92265ZM12.0002 12L5.93799 8.5V15.5L12.0002 19L18.0623 15.5V8.5L12.0002 12Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'DOWN_ARROW':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M8 13.4705L12 16.9999M12 16.9999L16 13.4705M12 16.9999V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'FLAG':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M14.1882 7.52941L13.8824 6H7V19H8.52941V13.6471H12.8118L13.1176 15.1765H18.4706V7.52941H14.1882Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'GRAPH':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M7 16.5L10.5 11L13 14L17 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'INFO':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M11.3335 8.66671H12.6668V10H11.3335V8.66671ZM11.3335 11.3334H12.6668V15.3334H11.3335V11.3334ZM12.0002 5.33337C8.32016 5.33337 5.3335 8.32004 5.3335 12C5.3335 15.68 8.32016 18.6667 12.0002 18.6667C15.6802 18.6667 18.6668 15.68 18.6668 12C18.6668 8.32004 15.6802 5.33337 12.0002 5.33337ZM12.0002 17.3334C9.06016 17.3334 6.66683 14.94 6.66683 12C6.66683 9.06004 9.06016 6.66671 12.0002 6.66671C14.9402 6.66671 17.3335 9.06004 17.3335 12C17.3335 14.94 14.9402 17.3334 12.0002 17.3334Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'MEGAPHONE':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M16.7498 10.7917V12.2084H19.5832V10.7917H16.7498ZM15.3332 15.4738C16.0132 15.9767 16.8986 16.6425 17.5998 17.1667C17.8832 16.7913 18.1665 16.4088 18.4498 16.0334C17.7486 15.5092 16.8632 14.8434 16.1832 14.3334C15.8998 14.7159 15.6165 15.0984 15.3332 15.4738ZM18.4498 6.96671C18.1665 6.59129 17.8832 6.20879 17.5998 5.83337C16.8986 6.35754 16.0132 7.02337 15.3332 7.53337C15.6165 7.90879 15.8998 8.29129 16.1832 8.66671C16.8632 8.15671 17.7486 7.49796 18.4498 6.96671ZM6.83317 9.37504C6.054 9.37504 5.4165 10.0125 5.4165 10.7917V12.2084C5.4165 12.9875 6.054 13.625 6.83317 13.625H7.5415V16.4584H8.95817V13.625H9.6665L13.2082 15.75V7.25004L9.6665 9.37504H6.83317ZM14.979 11.5C14.979 10.558 14.5682 9.70796 13.9165 9.12712V13.8659C14.5682 13.2921 14.979 12.4421 14.979 11.5Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'PERCENT':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <circle
            cx="8"
            cy="9"
            r="1.75"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="16"
            cy="14"
            r="1.75"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="9.22548"
            y1="16.4982"
            x2="14.8394"
            y2="6.77452"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'STAR':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M12 5L13.5716 9.83688H18.6574L14.5429 12.8262L16.1145 17.6631L12 14.6738L7.8855 17.6631L9.4571 12.8262L5.3426 9.83688H10.4284L12 5Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'SWAP':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M7.32357 17.9999L4.50007 14.7999M4.50007 14.7999L7.32357 11.5999M4.50007 14.7999H12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.6764 12.4L19.4999 9.20003M19.4999 9.20003L16.6764 6.00004M19.4999 9.20003H11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'UP_ARROW':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M8 10.5293L12 6.99995M12 6.99995L16 10.5293M12 6.99995V16.9999"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'URGENT':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM11.25 9.25C11.25 8.83579 11.5858 8.5 12 8.5C12.4142 8.5 12.75 8.83579 12.75 9.25V13.25C12.75 13.6642 12.4142 14 12 14C11.5858 14 11.25 13.6642 11.25 13.25V9.25ZM11.25 15.25C11.25 14.8358 11.5858 14.5 12 14.5C12.4142 14.5 12.75 14.8358 12.75 15.25C12.75 15.6642 12.4142 16 12 16C11.5858 16 11.25 15.6642 11.25 15.25Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'WATCH':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M11.9998 7C8.6665 7 5.81984 9.07333 4.6665 12C5.81984 14.9267 8.6665 17 11.9998 17C15.3332 17 18.1798 14.9267 19.3332 12C18.1798 9.07333 15.3332 7 11.9998 7ZM11.9998 15.3333C10.1598 15.3333 8.6665 13.84 8.6665 12C8.6665 10.16 10.1598 8.66667 11.9998 8.66667C13.8398 8.66667 15.3332 10.16 15.3332 12C15.3332 13.84 13.8398 15.3333 11.9998 15.3333ZM11.9998 10C10.8932 10 9.99984 10.8933 9.99984 12C9.99984 13.1067 10.8932 14 11.9998 14C13.1065 14 13.9998 13.1067 13.9998 12C13.9998 10.8933 13.1065 10 11.9998 10Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'empty-box':
      // NOTE: This icon does not allow to change color for now
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="21"
          viewBox="0 0 33 21"
          fill="none"
        >
          <path
            d="M0 12.375C0 11.6156 0.615609 11 1.375 11C2.13439 11 2.75 11.6156 2.75 12.375V16.5C2.75 17.2594 3.36561 17.875 4.125 17.875H6.875H28.875C29.6344 17.875 30.25 17.2594 30.25 16.5V12.375C30.25 11.6156 30.8656 11 31.625 11C32.3844 11 33 11.6156 33 12.375V17.875C33 19.3938 31.7688 20.625 30.25 20.625H2.75C1.23122 20.625 0 19.3938 0 17.875V12.375Z"
            fill="#B6B8D5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.5 6.875C15.9305 6.875 15.4687 6.41329 15.4687 5.84375L15.4687 1.03125C15.4687 0.461706 15.9305 -2.01818e-08 16.5 -4.50772e-08C17.0695 -6.99726e-08 17.5312 0.461706 17.5312 1.03125L17.5312 5.84375C17.5312 6.41329 17.0695 6.875 16.5 6.875Z"
            fill="#828AE3"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.653 8.39704C12.0191 7.96074 11.9622 7.31028 11.5259 6.94418L7.83935 3.85077C7.40305 3.48467 6.75258 3.54158 6.38649 3.97787C6.02039 4.41417 6.0773 5.06464 6.5136 5.43073L10.2002 8.52415C10.6365 8.89024 11.2869 8.83333 11.653 8.39704Z"
            fill="#828AE3"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.2879 8.39704C20.9218 7.96074 20.9787 7.31028 21.415 6.94418L25.1016 3.85077C25.5379 3.48467 26.1883 3.54158 26.5544 3.97787C26.9205 4.41417 26.8636 5.06464 26.4273 5.43073L22.7407 8.52415C22.3044 8.89024 21.654 8.83333 21.2879 8.39704Z"
            fill="#828AE3"
          />
        </svg>
      );
    default:
      return null;
  }
};
