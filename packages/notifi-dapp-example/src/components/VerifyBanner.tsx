import { CardView } from '@/app/notifi/dashboard/page';
import { Icon } from '@/assets/Icon';
import { useNotifiTargetContext } from '@/context/NotifiTargetContext';
import React, { useMemo } from 'react';

export type VerifyBannerProps = Readonly<{
  setCardView: (cardView: CardView) => void;
}>;

export const VerifyBanner: React.FC<VerifyBannerProps> = ({
  setCardView,
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
        default:
          return target;
      }
    });
    return convertedUnVerifiedDestinations.length > 1
      ? convertedUnVerifiedDestinations.join(' and ')
      : convertedUnVerifiedDestinations[0];
  }, [unVerifiedTargets]);

  return (
    <div className="flex flex-row justify-between items-center py-2 bg-notifi-card-bg mt-4 md:mt-6 rounded-[14px] mx-4 md:mx-0 md:mr-10">
      <div className="flex flex-row items-center justify-center ml-3 text-sm font-medium">
        <Icon
          id="check"
          className="text-notifi-button-primary-blueish-bg mr-3 w-3 mb-0.5"
        />
        <div className="text-notifi-text">
          Verify your {unVerifiedDestinationsString}
        </div>
      </div>
      <button
        onClick={() => setCardView('destination')}
        className="mr-3 w-18 h-8 bg-notifi-button-primary-blueish-bg rounded-md text-sm font-bold text-white disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
      >
        Verify
      </button>
    </div>
  );
};
