import { useState } from 'react';

export type startChatView = Readonly<{
  state: 'startChatView';
}>;

export type chatWindowView = Readonly<{
  state: 'chatWindowView';
}>;

export type settingView = Readonly<{
  state: 'settingView';
}>;

export type IntercomCardView = startChatView | chatWindowView | settingView;

export const useIntercomCardState = () => {
  const [intercomCardView, setIntercomCardView] = useState<IntercomCardView>({
    state: 'startChatView',
  });

  return {
    intercomCardView,
    setIntercomCardView,
  };
};
