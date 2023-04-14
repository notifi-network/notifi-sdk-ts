import { useState } from 'react';

export type PreviewViewState = Readonly<{
  state: 'preview';
}>;
export type AlertHistoryViewState = Readonly<{
  state: 'history';
}>;
export type EditInfoViewState = Readonly<{
  state: 'edit';
}>;
export type ExpiredTokenViewState = Readonly<{
  state: 'expired';
}>;
export type VerifyWalletViewState = Readonly<{
  state: 'verify';
}>;
export type SignUpViewState = Readonly<{
  state: 'signup';
}>;
export type VerifyOnboardingViewState = Readonly<{
  state: 'verifyonboarding';
}>;

export type ErrorViewState = Readonly<{
  state: 'error';
  reason: unknown;
}>;

export type FetchedCardViewState =
  | PreviewViewState
  | AlertHistoryViewState
  | EditInfoViewState
  | VerifyWalletViewState
  | ExpiredTokenViewState
  | SignUpViewState
  | VerifyOnboardingViewState
  | ErrorViewState;

export const useFetchedCardState = () => {
  const [cardView, setCardView] = useState<FetchedCardViewState>({
    state: 'history',
  });

  return {
    cardView,
    setCardView,
  };
};
