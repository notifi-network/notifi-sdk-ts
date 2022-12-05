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

export type loadingView = Readonly<{
  state: 'loadingView';
}>;

export type IntercomCardView =
  | startChatView
  | chatWindowView
  | settingView
  | loadingView;

export const useIntercomCardState = () => {
  const [intercomCardView, setIntercomCardView] = useState<IntercomCardView>({
    state: 'loadingView',
  });

  return {
    intercomCardView,
    setIntercomCardView,
  };
};
