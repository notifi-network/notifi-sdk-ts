import React from 'react';

type Props = {
  infoPromptMessage: string;
  onClick?: () => void;
  isButton?: boolean;
  buttonCopy?: string;
  isSent?: boolean;
  type?: string;
  isLoading?: boolean;
};

export const DestinationInfoPrompt: React.FC<Props> = ({
  infoPromptMessage,
  onClick,
  isButton = false,
  buttonCopy,
  isSent,
  type,
  isLoading,
}) => {
  if (!onClick) {
    return <label>{infoPromptMessage}</label>;
  }

  return (
    <div>
      {isButton ? (
        <button
          onClick={() => onClick()}
          className="ml-1 rounded-3xl bg-notifi-button-primary-bg text-notifi-button-primary-text w-24 h-8 text-sm font-medium disabled:opacity-50 disabled:hover:bg-notifi-button-primary-bg hover:bg-notifi-button-primary-bg"
        >
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-l-transparent text-white" />
            </div>
          ) : (
            buttonCopy
          )}
        </button>
      ) : (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick()}
          className={`text-sm font-semibold ${
            isSent ? 'text-notifi-text-light' : 'text-notifi-toggle-on-bg'
          } ${type === 'email' ? '' : 'ml-6'} cursor-pointer`}
        >
          <label className="cursor-pointer">{infoPromptMessage}</label>
        </a>
      )}
    </div>
  );
};
