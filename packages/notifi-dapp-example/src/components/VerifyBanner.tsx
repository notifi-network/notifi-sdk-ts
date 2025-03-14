import { CardView } from '@/app/notifi/dashboard/page';
import { Icon } from '@/assets/Icon';
import { useNotifiTargetContext } from '@notifi-network/notifi-react';
import React, { useMemo } from 'react';

export type VerifyBannerProps = Readonly<{
  setCardView: (cardView: CardView) => void;
  isInHistoryDetail: boolean;
  hasValidTargetMoreThanOne: boolean | undefined;
}>;

export const VerifyBanner: React.FC<VerifyBannerProps> = ({
  setCardView,
  isInHistoryDetail,
  hasValidTargetMoreThanOne,
}: VerifyBannerProps) => {
  const { unVerifiedTargets } = useNotifiTargetContext();

  const unVerifiedDestinationsString = useMemo(() => {
    const convertedUnVerifiedDestinations = unVerifiedTargets.map((target) => {
      switch (target) {
        case 'email':
          return 'Email';
        case 'telegram':
          return 'Telegram ID';
        case 'discord':
          return 'Discord';
        case 'slack':
          return 'Slack';
        case 'phoneNumber':
          return 'Phone Number';
        case 'wallet':
          return 'Wallet';
        default:
          return target;
      }
    });
    return convertedUnVerifiedDestinations.length > 1
      ? convertedUnVerifiedDestinations.join(' and ')
      : convertedUnVerifiedDestinations[0];
  }, [unVerifiedTargets]);

  return (
    <div
      className={`flex flex-row justify-between items-center py-2 bg-notifi-card-bg mt-4 mb-3 md:mt-6 rounded-[14px] mx-4 md:mx-0 md:mr-10 md:mb-0 ${
        isInHistoryDetail ? 'md:flex hidden' : ''
      }`}
    >
      <div className="flex flex-row items-center justify-center ml-4 text-sm font-medium">
        {hasValidTargetMoreThanOne ? (
          <Icon
            id="check"
            className="text-notifi-button-primary-bg mr-3 w-3 mb-0.5"
          />
        ) : (
          <Icon
            id="banner-bell"
            className="text-notifi-button-primary-bg mr-3 w-3 h-3 text-center"
          />
        )}
        <div className="text-notifi-text mr-1">
          {hasValidTargetMoreThanOne
            ? `Verify your ${unVerifiedDestinationsString}`
            : 'Get notifications to the destinations of your choice'}
        </div>
      </div>
      <button
        onClick={() => setCardView('destination')}
        className="mr-3 w-18 h-8 bg-notifi-button-primary-blueish-bg rounded-md text-sm font-bold text-white disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
      >
        {hasValidTargetMoreThanOne ? 'Verify' : 'Add'}
      </button>
    </div>
  );
};
