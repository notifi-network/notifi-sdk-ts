import {
  type ActivateSmartLinkActionResponse,
  type SmartLinkActionUserInput,
} from '@notifi-network/notifi-dataplane';
import {
  type AuthParams,
  type NotifiEnvironment,
  NotifiError,
  NotifiSmartLinkClient,
  SmartLinkAction,
  type SmartLinkConfig,
  newSmartLinkClient,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';
import { type SmartLinkConfigWithIsActive } from 'notifi-frontend-client/lib/client/fetchSmartLinkConfig';
import React, { FC, PropsWithChildren } from 'react';

type NotifiSmartLinkContextType = {
  authParams?: AuthParams;
  smartLinkConfigDictionary: SmartLinkConfigDictionary;
  actionDictionary: ActionDictionary;
  isLoading: boolean;
  error: Error | null;
  renewSmartLinkConfigAndActionDictionary: (
    smartLinkId: string,
  ) => Promise<void>;
  /* If userInput is undefined, reset the userInputs to initial state */
  updateActionUserInputs: (
    smartLinkIdWithActionId: SmartLinkIdWithActionId,
    userInput?: { [userInputId: number]: ActionUserInputWithValidation },
  ) => void;
  executeSmartLinkAction: (
    args: Parameters<NotifiSmartLinkClient['activateSmartLinkAction']>[0] & {
      execute: ActionHandler;
    },
  ) => Promise<void>;
};

export type ActionHandlerArgs = {
  smartLinkId: string;
  actionId: string;
  payload: ActivateSmartLinkActionResponse;
};

export type ActionHandler = (args: ActionHandlerArgs) => Promise<void>;

type SmartLinkConfigDictionary = Record<string, SmartLinkConfigWithIsActive>;
type ActionDictionary = Record<
  SmartLinkIdWithActionId,
  {
    action: SmartLinkAction;
    userInputs: Record<number, ActionUserInputWithValidation>;
  }
>;
export type SmartLinkIdWithActionId = `${string}:;:${string}`; // `${smartLinkId}:;:${actionId}`

type ActionUserInputWithValidation = {
  userInput: SmartLinkActionUserInput;
  isValid: boolean;
};

const NotifiSmartLinkContext = React.createContext<NotifiSmartLinkContextType>(
  {} as NotifiSmartLinkContextType /** Intentionally empty for validator */,
);

export type NotifiSmartLinkContextProps = {
  env?: NotifiEnvironment;
  authParams?: AuthParams;
};

export const NotifiSmartLinkContextProvider: FC<
  PropsWithChildren<NotifiSmartLinkContextProps>
> = ({ authParams, children, env = 'Production' }) => {
  const [smartLinkClient, setSmartLinkClient] =
    React.useState<NotifiSmartLinkClient | null>(null);
  const [smartLinkConfigDictionary, setSmartLinkConfigDictionary] =
    React.useState<SmartLinkConfigDictionary>({});
  const [actionDictionary, setActionDictionary] =
    React.useState<ActionDictionary>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const smartLinkClient = newSmartLinkClient({ env, authParams });
    setSmartLinkClient(smartLinkClient);
  }, [authParams]);

  const updateActionUserInputs: NotifiSmartLinkContextType['updateActionUserInputs'] =
    (smartLinkIdWithActionId, userInput?) => {
      if (!objectKeys(actionDictionary).includes(smartLinkIdWithActionId)) {
        setError(
          new Error(
            '.updateActionDictionary: IDs not matched in NotifiSmartLinkContext',
          ),
        );
        return;
      }

      if (!userInput) {
        const action = actionDictionary[smartLinkIdWithActionId].action;

        setActionDictionary((prev) => ({
          ...prev,
          [smartLinkIdWithActionId]: {
            action,
            userInputs: getInitialUserInputs(action),
          },
        }));
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

  const executeSmartLinkAction: NotifiSmartLinkContextType['executeSmartLinkAction'] =
    React.useCallback(
      async (args) => {
        if (!smartLinkClient) {
          const error = new Error('NotifiSmartLinkClient is not initialized');
          setError(error);
          return;
        }
        try {
          setIsLoading(true);
          const { execute, ...activateSmartLinkActionArgs } = args;
          const payload = await smartLinkClient.activateSmartLinkAction(
            activateSmartLinkActionArgs,
          );
          await execute({
            smartLinkId: activateSmartLinkActionArgs.smartLinkId,
            actionId: activateSmartLinkActionArgs.actionId,
            payload,
          });
          setError(null);
        } catch (e) {
          setError(NotifiError.from(e));
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      },
      [smartLinkClient],
    );

  const renewSmartLinkConfigAndActionDictionary: NotifiSmartLinkContextType['renewSmartLinkConfigAndActionDictionary'] =
    React.useCallback(
      async (smartLinkId) => {
        if (!smartLinkClient) {
          const error = new Error('SmartLinkClient is not initialized');
          setError(error);
          return;
        }

        try {
          setIsLoading(true);
          const smartLinkConfigWithIsActive =
            await smartLinkClient.fetchSmartLinkConfig(smartLinkId);

          const actionDict = initActionDictionary(
            smartLinkId,
            smartLinkConfigWithIsActive.smartLinkConfig,
          );

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
            [smartLinkId]: smartLinkConfigWithIsActive,
          }));
          setError(null);
        } catch (e) {
          setError(NotifiError.from(e));
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
      const userInputs = getInitialUserInputs(action);

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

const getInitialUserInputs = (
  action: SmartLinkAction,
): Record<number, ActionUserInputWithValidation> => {
  const userInputs = action.inputs.reduce(
    (acc: Record<number, ActionUserInputWithValidation>, input, id) => {
      const userInput: ActionUserInputWithValidation =
        input.type === 'TEXTBOX'
          ? {
              userInput: {
                type: 'TEXTBOX',
                value: '', // init value as empty
                id: input.id,
              },
              isValid: input.isRequired ? false : true,
            }
          : {
              userInput: { type: 'CHECKBOX', value: false, id: input.id }, // init value as unchecked
              isValid: input.isRequired ? false : true,
            };

      acc[id] = userInput;
      return acc;
    },
    {},
  );
  return userInputs;
};
