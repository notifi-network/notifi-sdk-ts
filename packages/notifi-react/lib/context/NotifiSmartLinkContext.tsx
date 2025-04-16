import { SmartLinkActionUserInput } from '@notifi-network/notifi-dataplane';
import {
  AuthParams,
  type ExecuteSmartLinkActionArgs,
  type NotifiEnvironment,
  NotifiSmartLinkClient,
  SmartLinkAction,
  type SmartLinkConfig,
  newSmartLinkClient,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';
import React, { FC, PropsWithChildren } from 'react';

type NotifiSmartLinkContextType = {
  // TODO: rather than define the redundant type, we can extract the type from function
  updateActionUserInputs: (
    smartLinkIdWithActionId: SmartLinkIdWithActionId,
    userInput: { [userInputId: number]: ActionUserInputWithValidation },
  ) => void;
  authParams: AuthParams;
  smartLinkConfigDictionary: Record<string, SmartLinkConfig>;
  actionDictionary: ActionDictionary;
  renewSmartLinkConfigAndActionDictionary: (
    smartLinkId: string,
  ) => Promise<void>;
  executeSmartLinkAction: (args: ExecuteSmartLinkActionArgs) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

export type SmartLinkIdWithActionId = `${string}:;:${string}`; // `${smartLinkId}:;:${actionId}`
type SmartLinkConfigDictionary = Record<string, SmartLinkConfig>;
type ActionDictionary = Record<
  SmartLinkIdWithActionId,
  {
    action: SmartLinkAction;
    userInputs: Record<number, ActionUserInputWithValidation>;
  }
>;
type ActionUserInputWithValidation = {
  userInput: SmartLinkActionUserInput;
  isValid: boolean;
};

const NotifiSmartLinkContext = React.createContext<NotifiSmartLinkContextType>(
  {} as NotifiSmartLinkContextType /** Intentionally empty for validator */,
);

export type NotifiSmartLinkContextProps = {
  env?: NotifiEnvironment;
  authParams: AuthParams;
};

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
  const updateActionUserInputs = (
    smartLinkIdWithActionId: SmartLinkIdWithActionId,
    userInput: { [userInputId: number]: ActionUserInputWithValidation },
  ) => {
    if (!objectKeys(actionDictionary).includes(smartLinkIdWithActionId)) {
      setError(
        new Error(
          '.updateActionDictionary: IDs not matched in NotifiSmartLinkContext',
        ),
      );
      return;
    }

    setActionDictionary((prev) => ({
      ...prev,
      [smartLinkIdWithActionId]: {
        ...prev[smartLinkIdWithActionId],
        userInputs: {
          ...prev[smartLinkIdWithActionId].userInputs,
          ...userInput,
        },
      },
    }));
  };

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

        const actionDict = initActionDictionary(smartLinkId, smartLinkConfig);

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

  if (!smartLinkClient) return null;

  return (
    <NotifiSmartLinkContext.Provider
      value={{
        updateActionUserInputs,
        authParams,
        renewSmartLinkConfigAndActionDictionary,
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

const initActionDictionary = (
  smartLinkId: string,
  smartLinkConfig: SmartLinkConfig,
) => {
  const smartLinkActions = smartLinkConfig.components.filter(
    (component) => component.type === 'ACTION',
  );

  const actionDict = smartLinkActions.reduce(
    (acc: ActionDictionary, action) => {
      const actionId = action.id;
      // TODO: Fix O(n^2) issue
      const userInputs = action.inputs.reduce(
        (acc: Record<number, ActionUserInputWithValidation>, input, id) => {
          const userInput: ActionUserInputWithValidation =
            input.type === 'TEXTBOX'
              ? {
                  userInput: {
                    type: 'TEXTBOX',
                    value: input.default,
                    id: input.id,
                  },
                  isValid: false,
                }
              : {
                  userInput: { type: 'CHECKBOX', value: false, id: input.id },
                  isValid: false,
                };

          acc[id] = userInput;
          return acc;
        },
        {},
      );

      acc[`${smartLinkId}:;:${actionId}`] = {
        action,
        userInputs,
      };
      return acc;
    },
    {},
  );
  return actionDict;
};
