import { CardView } from '@/app/notifi/dashboard/page';
import { Icon } from '@/assets/Icon';
import { FormField } from '@notifi-network/notifi-react-card';
import React, { useMemo } from 'react';

export type VerifyBannerProps = Readonly<{
  unVerifiedDestinations: ReadonlyArray<FormField>;
  setCardView: (cardView: CardView) => void;
}>;

export const VerifyBanner: React.FC<VerifyBannerProps> = ({
  unVerifiedDestinations,
  setCardView,
}: VerifyBannerProps) => {
  const unVerifiedDestinationsString = useMemo(() => {
    const convertedUnVerifiedDestinations = unVerifiedDestinations.map(
      (target) => {
        switch (target) {
          case 'telegram':
            return 'Telegram ID';
          case 'discord':
            return 'Discord';
          case 'phoneNumber':
            return 'Phone Number';
          default:
            return target;
        }
      },
    );
    return convertedUnVerifiedDestinations.length > 1
      ? convertedUnVerifiedDestinations.join(' and ')
      : convertedUnVerifiedDestinations[0];
  }, [unVerifiedDestinations]);

  return (
    <>
      <div className="flex flex-row justify-between items-center h-12 bg-white mt-6 rounded-xl mr-10">
        <div className="flex flex-row items-center justify-center ml-3 text-sm font-semibold">
          <Icon
            id="check"
            className="text-notifi-button-primary-blueish-bg mr-3 w-3 mb-0.5"
          />
          <div>Verify your {unVerifiedDestinationsString}</div>
        </div>
        <button
          onClick={() => setCardView('destination')}
          className="mr-3 w-18 h-8 bg-notifi-button-primary-blueish-bg rounded-md text-sm font-bold text-white"
        >
          Verify
        </button>
      </div>
    </>
  );
};
