import React from 'react';

type Props = {
  infoPromptMessage: string;
  onClick?: () => void;
  isButton?: boolean;
  buttonCopy?: string;
  isSent?: boolean;
  type?: string;
};

export const DestinationInfoPrompt: React.FC<Props> = ({
  infoPromptMessage,
  onClick,
  isButton = false,
  buttonCopy,
  isSent,
  type,
}) => {
  if (!onClick) {
    return <label>{infoPromptMessage}</label>;
  }

  return (
    <div>
      {isButton ? (
        <button
          onClick={() => onClick()}
          className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-24 h-8 text-sm font-medium disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg ml-1.5"
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
          } ${type === 'email' ? '' : 'ml-6'} cursor-pointer`}
        >
          <label className="cursor-pointer">{infoPromptMessage}</label>
        </a>
      )}
    </div>
  );
};
