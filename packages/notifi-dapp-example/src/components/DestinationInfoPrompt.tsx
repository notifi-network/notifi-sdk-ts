import React from 'react';

type Props = {
  infoPromptMessage: string;
  onClick?: () => void;
  isButton?: boolean;
  buttonCopy?: string;
  isSent?: boolean;
};

export const DestinationInfoPrompt: React.FC<Props> = ({
  infoPromptMessage,
  onClick,
  isButton = false,
  buttonCopy,
  isSent,
}) => {
  if (!onClick) {
    return <label>{infoPromptMessage}</label>;
  }

  return (
    <div>
      {isButton ? (
        <button
          onClick={() => onClick()}
          className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-24 h-8 text-sm font-bold disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
        >
          {buttonCopy}
        </button>
      ) : (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick()}
          className={`text-sm font-semibold ${
            isSent
              ? 'text-notifi-text-light'
              : 'text-notifi-button-primary-blueish-bg'
          } ml-6 cursor-pointer`}
        >
          <label className="cursor-pointer">{infoPromptMessage}</label>
        </a>
      )}
    </div>
  );
};
