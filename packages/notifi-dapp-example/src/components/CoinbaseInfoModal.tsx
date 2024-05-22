import { Icon } from '@/assets/Icon';
import Image from 'next/image';
import React from 'react';

export type CoinbaseInfoModalProps = {
  handleClose: () => void;
  open: boolean;
};
export const CoinbaseInfoModal: React.FC<CoinbaseInfoModalProps> = ({
  handleClose,
  open,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 z-50 bg-black opacity-60" />
      <div className="fixed inset-0 z-50 m-5 sm:m-auto max-w-[682px] max-h-[567px] rounded-3xl border border-[#565A8D] bg-[#1A283F]">
        <div className="flex justify-center max-h-full overflow-hidden">
          <div className="w-full px-4 sm:px-0 overflow-y-scroll sm:overflow-y-hidden">
            <div
              className="cursor-pointer absolute top-8 right-8"
              onClick={handleClose}
            >
              <Icon id="close-icon" className="text-notifi-text-light" />
            </div>

            <div className="text-center mt-12">
              <p className="text-xl text-notifi-text font-medium">
                Enable Messaging in Coinbase Wallet
              </p>
            </div>

            <div className="flex flex-col justify-center items-center mt-5 pt-0.5 text-base font-medium text-notifi-text-medium">
              <p className="text-center sm:max-w-lg">
                In your Coinbase Wallet mobile app, click on the message icon in
                the top right of the screen. Then click ‘Start Messaging’
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Image
                src="/logos/CB1.png"
                width={200}
                height={388}
                unoptimized={true}
                alt="CB1"
              />

              <Image
                src="/logos/CB2.png"
                width={200}
                height={388}
                unoptimized={true}
                alt="CB2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
