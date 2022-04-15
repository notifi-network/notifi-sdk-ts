import { useNotifiCopyContext, useNotifiStyleContext } from '../context';
import { NotifiLogo } from './NotifiLogo';
import React from 'react';

export const NotifiFooter: React.FC = () => {
  const { footer: copy } = useNotifiCopyContext();
  const { footer: styles } = useNotifiStyleContext();

  return (
    <div className={styles?.container}>
      <span className={styles?.poweredBy}>
        {copy?.poweredBy ?? 'Powered by'}
      </span>
      <NotifiLogo className={styles?.logoSvg} />
      <span className={styles?.spacer} />
      <span className={styles?.link}>
        <a
          href="https://docs.notifi.network/NotifiIntegrationsFAQ.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy?.learnMore ?? 'Learn more'}
        </a>
      </span>
    </div>
  );
};
