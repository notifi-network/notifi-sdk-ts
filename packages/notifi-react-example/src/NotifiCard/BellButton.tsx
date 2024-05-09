import { useUnreadState } from '@notifi-network/notifi-react-card';
import { FC } from 'react';

import style from './BellButton.module.css';

type BellButtonProps = {
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BellButton: FC<BellButtonProps> = ({ setIsCardOpen }) => {
  const { hasUnreadNotification, unreadNotificationCount, clearNotificationCount } = useUnreadState();
  const cardOpen = () => {
    setIsCardOpen((prev) => !prev);
    clearNotificationCount();
  }
  return (
    <div
      onClick={() => cardOpen()}
      className={style.bellButton}
    >
      <img width={40} height={40} src="/bell-icon.svg" alt="logo" />
      {hasUnreadNotification ? (
        <div className={style.numberBadge}>
          <svg
            width="25"
            height="19"
            viewBox="0 0 25 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="24"
              height="18"
              rx="9"
              fill="#FA825D"
            />
          </svg>
          <div className={style.numberBadgeContent}>
            <div>
              {unreadNotificationCount > 99 ? '99' : unreadNotificationCount}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
