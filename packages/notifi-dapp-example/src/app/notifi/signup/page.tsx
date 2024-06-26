'use client';

import { InputFields } from '@/components/InputFields';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SignUpButton } from '@/components/SignUpButton';
import {
  useNotifiFrontendClientContext,
  useNotifiTenantConfigContext,
} from '@notifi-network/notifi-react';
import { useState } from 'react';

export default function NotifiSignup() {
  const { cardConfig } = useNotifiTenantConfigContext();
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const [isLoading, setIsLoading] = useState(false);

  if (!frontendClientStatus.isAuthenticated || !cardConfig) return null;

  return (
    <>
      {isLoading ? (
        <div className="fixed h-screen w-screen bg-opacity-50 bg-black z-50">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full sm:min-h-[550px] sm:w-4/6 bg-notifi-card-bg rounded-2xl flex flex-col items-center justify-between mb-8 px-4">
          <div className="w-full">
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold text-xs opacity-50 mt-2.5 text-notifi-text-medium">
                STEP 1 OF 3
              </p>
              <p className="font-medium text-lg md:mt-6 mt-2 text-notifi-text">
                How do you want to be notified?
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-full mb-6 sm:mb-0">
              <p className="text-sm opacity-50 font-medium md:my-4 mt-2 mb-6 text-notifi-text-medium">
                Select a minimum of one destination
              </p>
              <InputFields
                contactInfo={cardConfig.contactInfo}
                inputDisabled={false}
              />
            </div>
          </div>
          <SignUpButton
            data={cardConfig}
            buttonText="Next"
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      )}
    </>
  );
}
