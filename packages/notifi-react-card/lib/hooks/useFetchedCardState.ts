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

export type FetchedCardViewState =
  | PreviewViewState
  | AlertHistoryViewState
  | EditInfoViewState
  | VerifyWalletViewState
  | ExpiredTokenViewState
  | SignUpViewState
  | VerifyOnboardingViewState;

export const useFetchedCardState = () => {
  const [cardView, setCardView] = useState<FetchedCardViewState>({
    state: 'signup',
  });

  return {
    cardView,
    setCardView,
  };
};
