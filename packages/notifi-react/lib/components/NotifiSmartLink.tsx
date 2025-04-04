import {
  ExecuteSmartLinkActionArgs,
  SmartLinkConfig,
} from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { useNotifiSmartLinkContext } from '../context/NotifiSmartLinkContext';
import { ErrorView } from './ErrorView';

export type NotifiSmartLinkProps = {
  smartLinkId: string;
  actionHandler: (
    args: Omit<ExecuteSmartLinkActionArgs, 'authParams'>,
  ) => Promise<void>;
};

export const NotifiSmartLink: React.FC<NotifiSmartLinkProps> = (props) => {
  const { fetchSmartLinkConfig, error, isLoading } =
    useNotifiSmartLinkContext();
  const [smartLinkConfig, setSmartLinkConfig] =
    React.useState<SmartLinkConfig | null>(null);

  React.useEffect(() => {
    fetchSmartLinkConfig(props.smartLinkId)
      .then((config) => {
        if (config) {
          setSmartLinkConfig(config);
        }
      })
      .catch((error) => {
        console.error('Error fetching smart link config:', error);
      });
  }, [props.smartLinkId]);

  if (!smartLinkConfig) {
    return null;
  }

  if (error) {
    // TODO: customize error style
    return <ErrorView />;
  }

  return (
    <>
      {smartLinkConfig ? (
        <div onClick={() => console.log(smartLinkConfig)}>
          <div>{JSON.stringify(smartLinkConfig)}</div>
        </div>
      ) : null}
    </>
  );
};
