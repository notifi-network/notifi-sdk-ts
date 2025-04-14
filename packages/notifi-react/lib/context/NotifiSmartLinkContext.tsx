import { SmartLinkActionUserInput } from '@notifi-network/notifi-dataplane';
import {
  ActionInputParams,
  AuthParams,
  type ExecuteSmartLinkActionArgs,
  type NotifiEnvironment,
  NotifiSmartLinkClient,
  type SmartLinkConfig,
  newSmartLinkClient,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';
import { SmartLinkConfigWithIsActive } from 'notifi-frontend-client/lib/client/fetchSmartLinkConfig';
import React, { FC, PropsWithChildren } from 'react';

type NotifiSmartLinkContextType = {
  fetchSmartLinkConfig: (
    id: string,
  ) => Promise<SmartLinkConfigWithIsActive | null>;
  smartLinkConfigDictionary: Record<string, SmartLinkConfig>;
  actionDictionary: ActionDictionary;
  renewSmartLinkConfigAndActionDictionary: (
    smartLinkId: string,
  ) => Promise<void>;
  executeSmartLinkAction: (args: ExecuteSmartLinkActionArgs) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

const NotifiSmartLinkContext = React.createContext<NotifiSmartLinkContextType>(
  {} as NotifiSmartLinkContextType /** Intentionally empty for validator */,
);

type NotifiSmartLinkContextProps = {
  env?: NotifiEnvironment;
  authParams: AuthParams;
};

type ActionDictionary = Record<
  string,
  {
    smartLinkId: string;
    inputParams: ActionInputParams[];
    userInputs: Record<number, SmartLinkActionUserInput>;
  }
>;

type SmartLinkConfigDictionary = Record<string, SmartLinkConfig>;

export const NotifiSmartLinkContextProvider: FC<
  PropsWithChildren<NotifiSmartLinkContextProps>
> = ({ authParams, children, env = 'Production' }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const [smartLinkClient, setSmartLinkClient] =
    React.useState<NotifiSmartLinkClient | null>(null);
  const [actionDictionary, setActionDictionary] =
    React.useState<ActionDictionary>({});
  const [smartLinkConfigDictionary, setSmartLinkConfigDictionary] =
    React.useState<SmartLinkConfigDictionary>({});
  React.useEffect(() => {
    const smartLinkClient = newSmartLinkClient({ env, authParams });
    setSmartLinkClient(smartLinkClient);
  }, [authParams]);

  // TODO: implement useCallback to update action dictionary
  const updateActionDictionary = (
    actionId: string,
    userInput: ActionDictionary[string]['userInputs'],
  ) => {
    if (!objectKeys(actionDictionary).includes(actionId)) {
      setError(
        new Error(
          '.updateActionDictionary: Action ID not found in NotifiSmartLinkContext',
        ),
      );
      return;
    }
    setActionDictionary((prev) => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        userInputs: {
          ...prev[actionId].userInputs,
          ...userInput,
        },
      },
    }));
  };

  const fetchSmartLinkConfig = React.useCallback(
    async (smartLinkId: string) => {
      if (!smartLinkClient) {
        const error = new Error('SmartLinkClient is not initialized');
        setError(error);
        return null;
      }

      try {
        setIsLoading(true);
        const smartLinkConfigWithIsActive =
          await smartLinkClient.fetchSmartLinkConfig(smartLinkId);
        setError(null);
        return smartLinkConfigWithIsActive;
      } catch (e) {
        setError(e as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [smartLinkClient],
  );

  const executeSmartLinkAction = React.useCallback(
    async (args: ExecuteSmartLinkActionArgs) => {
      if (!smartLinkClient) {
        const error = new Error('NotifiSmartLinkClient is not initialized');
        setError(error);
        return;
      }
      try {
        setIsLoading(true);
        await smartLinkClient.executeSmartLinkAction(args);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [smartLinkClient],
  );

  const renewSmartLinkConfigAndActionDictionary = React.useCallback(
    async (smartLinkId: string) => {
      if (!smartLinkClient) {
        const error = new Error('SmartLinkClient is not initialized');
        setError(error);
        return;
      }

      try {
        setIsLoading(true);
        const { smartLinkConfig, isActive } =
          await smartLinkClient.fetchSmartLinkConfig(smartLinkId);

        const actionDict = getActionDictionary(smartLinkId, smartLinkConfig);
        /* Only append the new actionId to the actionDictionary */
        setActionDictionary((prev) => {
          const additions = objectKeys(actionDict)
            .filter((id) => !objectKeys(prev).includes(id))
            .reduce((acc: ActionDictionary, id) => {
              acc[id] = actionDict[id];
              return acc;
            }, {});
          return {
            ...prev,
            ...additions,
          };
        });

        setSmartLinkConfigDictionary((prev) => ({
          ...prev,
          [smartLinkId]: smartLinkConfig,
        }));
        setError(null);
      } catch (e) {
        setError(e as Error);
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [smartLinkClient],
  );

  return (
    <NotifiSmartLinkContext.Provider
      value={{
        renewSmartLinkConfigAndActionDictionary,
        fetchSmartLinkConfig,
        executeSmartLinkAction,
        smartLinkConfigDictionary,
        actionDictionary,
        isLoading,
        error,
      }}
    >
      {children}
    </NotifiSmartLinkContext.Provider>
  );
};

export const useNotifiSmartLinkContext = () => {
  const context = React.useContext(NotifiSmartLinkContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error(
      'useNotifiSmartLinkContext must be used within a NotifiSmartLinkContextProvider',
    );
  }
  return context;
};

// Utils

const getActionDictionary = (
  smartLinkId: string,
  smartLinkConfig: SmartLinkConfig,
) => {
  const smartLinkActions = smartLinkConfig.components.filter(
    (component) => component.type === 'ACTION',
  );

  const actionDict = smartLinkActions.reduce(
    (acc: ActionDictionary, action) => {
      const actionId = action.id;
      const inputParams = action.inputs;
      // TODO: Fix O(n^2) issue
      const userInputs = action.inputs.reduce(
        (acc: Record<number, SmartLinkActionUserInput>, input, id) => {
          const userInput: SmartLinkActionUserInput =
            input.type === 'TEXTBOX'
              ? { type: 'TEXTBOX', value: input.default, id: input.id }
              : { type: 'CHECKBOX', value: false, id: input.id };
          acc[id] = userInput;
          return acc;
        },
        {},
      );

      acc[actionId] = {
        smartLinkId: 'placeholder',
        inputParams,
        userInputs,
      };
      return acc;
    },
    {},
  );

  objectKeys(actionDict).forEach((actionId) => {
    actionDict[actionId].smartLinkId = smartLinkId;
  });
  return actionDict;
};
